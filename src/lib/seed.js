export function trySeedPostsForInterests(tags) {
  try {
    const raw = localStorage.getItem('posts')
    const existing = raw ? JSON.parse(raw) : []
    if (Array.isArray(existing) && existing.length > 0) return // don't overwrite existing posts

    const sampleAuthors = ['Maria Garcia','David Chen','Aisha Patel','Liam O\'Connor','Chen Wei']
    const sampleByTag = {
      'React': [{ title: 'React Hooks Deep Dive', content: 'Hooks changed how we author React components...', tags:['React','JavaScript'] }],
      'JavaScript': [{ title: 'Async Patterns in JS', content: 'Promises, async/await and cancellation...', tags:['JavaScript'] }],
      'Python': [{ title: 'Pythonic Idioms', content: 'List comprehensions, generators and context managers...', tags:['Python'] }],
      'Data Science': [{ title: 'Exploratory Data Analysis', content: 'Start with visualization and summary stats...', tags:['Data Science'] }],
      'Machine Learning': [{ title: 'Intro to ML Models', content: 'Understanding supervised vs unsupervised learning...', tags:['Machine Learning'] }],
      'CSS': [{ title: 'Modern CSS Layouts', content: 'Grid and Flexbox make layout easier...', tags:['CSS','Design'] }],
      'UX': [{ title: 'Design Thinking Basics', content: 'Empathize, Define, Ideate, Prototype, Test...', tags:['UX','Design'] }],
      'Cloud': [{ title: 'Getting started with Cloud', content: 'Cloud providers offer compute, storage and managed services...', tags:['Cloud'] }],
      'Security': [{ title: 'Intro to Cybersecurity', content: 'Fundamentals of securing systems and networks...', tags:['Security'] }],
    }

    // build a small list of posts based on tags (or fall back to some general ones)
    const chosen = new Set()
    if (Array.isArray(tags) && tags.length>0){
      tags.forEach(t=>{
        if (sampleByTag[t]) sampleByTag[t].forEach(s=>chosen.add(JSON.stringify(s)))
      })
    }
    if (chosen.size === 0){
      // fallbacks
      Object.values(sampleByTag).slice(0,4).forEach(arr=> arr.forEach(s=> chosen.add(JSON.stringify(s))))
    }

    const samples = Array.from(chosen).map((s, idx)=>{
      const obj = JSON.parse(s)
      return {
        id: Date.now() + idx,
        author: sampleAuthors[idx % sampleAuthors.length],
        // stable-ish identifier for seeded authors (used to compare ownership)
        authorId: (sampleAuthors[idx % sampleAuthors.length] || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
        // stagger createdAt values so relative time looks reasonable
        createdAt: Date.now() - ((idx + 1) * 60 * 60 * 1000),
        title: obj.title,
        content: obj.content,
        tags: obj.tags || [],
        likes: 0,
        comments: [],
        time: '1 day ago'
      }
    })

    try{ localStorage.setItem('posts', JSON.stringify(samples)) }catch(e){}
  } catch (e) { console.error('seed posts failed', e) }
}

export default { trySeedPostsForInterests }
