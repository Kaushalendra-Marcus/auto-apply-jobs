app.post('/apply', async (req, res) => {
  const { jobId, apiKey, title, company, url } = req.body
  if (!apiKey) return res.status(401).json({ error: 'No API key' })

  try {
    const profileRes = await fetch(`http://localhost:3000/api/automation/profile`, {
      headers: { 'x-api-key': apiKey },
    })
    const { profile } = await profileRes.json()

    // THIS is the Accomplish integration - send task to Accomplish
    const accomplishTask = {
      task: `Go to ${url} and apply for the ${title} position at ${company}. 
             Use these details:
             Name: ${profile.name}
             Email: ${profile.email}
             Phone: ${profile.phone}
             Skills: ${profile.skills?.join(', ')}
             Fill out the application form completely and submit it.`,
    }

    // Call Accomplish's local API (it runs on port 3003 by default)
    const accomplishRes = await fetch('http://localhost:3003/api/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accomplishTask),
    }).catch(() => null)

    // Log it in our DB regardless
    await fetch('http://localhost:3000/api/automation/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ jobId, status: 'applied', title, company, url }),
    })

    if (accomplishRes?.ok) {
      console.log(`🤖 Accomplish is applying to "${title}" at ${company}`)
      res.json({ success: true, message: `Accomplish is applying to ${title} at ${company}!` })
    } else {
      console.log(`📝 Logged application to "${title}" (Accomplish not running)`)
      res.json({ success: true, message: `Application tracked for ${title} at ${company}` })
    }
  } catch (error) {
    console.error('Bridge error:', error)
    res.status(500).json({ error: 'Bridge server error' })
  }
})