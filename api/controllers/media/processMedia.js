export default async (req, res) => {
  const { ProjectId } = req.body
  console.log("ProjectId:", ProjectId)
  return res.json({ success: true })
}

/*
curl -X POST http://localhost:3001/media/process -H "Authorization: Bearer 74db58e0-8ae2-43c9-9378-99a4a64667d2" -H "Content-Type: application/json" -d '{"url": "https://www.google.com"}'
*/