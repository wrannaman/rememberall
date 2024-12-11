import { pg } from './connections/index.js'

// The Compiler setup
export default async () => {
  console.log('bootstrap');
  const { Project, Org, User, Team, TeamXUser, Source, Platform } = pg.models
  return

  try {
    // see if 1 org exists with name "ap". if not create it 
    let org = await Org.findOne({ where: { name: 'ap' } })
    if (!org) {
      org = await Org.create({ name: 'ap', id: '5493ae7d-8a84-4299-a960-426099f5bcf7' })
    }
    // see if user andrewpierno@gmail.com exists. if not create it
    let user = await User.findOne({ where: { email: 'andrewpierno@gmail.com', } })
    if (!user) {
      user = await User.create({ email: 'andrewpierno@gmail.com', name: 'andrew', OrgId: org.id, id: '2004d03c-f4a3-4f1e-841a-5e74c000d630' })
    }
    let team = await Team.findOne({ where: { name: 'The Compiler', OrgId: org.id } })
    if (!team) {
      team = await Team.create({ name: 'The Compiler', OrgId: org.id, id: '1d202f8b-0fb2-4e68-b35a-974bd9a6817f' })
    }
    let t_x_user = await TeamXUser.findOne({ where: { TeamId: team.id, UserId: user.id } })
    if (!t_x_user) {
      await TeamXUser.create({ TeamId: team.id, UserId: user.id })
    }
    // find or create project "The Compiler" for this org
    let project = await Project.findOne({ where: { name: 'The Compiler', OrgId: org.id } })
    if (!project) {
      project = await Project.create({ name: 'The Compiler', OrgId: org.id, id: '33d39951-358c-49e6-b1cb-7fb395fb5f9b' })
    }
    //     project.update({
    //       description: `The Compiler is a daily curation of tech news.`,
    //       prompt: {
    //         persona: `TARGET PERSONA: Tech Professional (a tech bro) (A startup founder, software engineer, YC founder, etc)
    // - Software engineers, developers, tech leads (mid to senior level)
    // - Values technical depth over surface-level news
    // - Wants concrete, practical, short "why this matters"
    // - Interested in performance metrics and benchmarks
    // - Seeks news that impacts technical decision-making
    // - Appreciates specific examples over general trends
    // - Technical but not academic; practical but not overly casual`,
    //         intro: "<p>Welcome to The Compiler, a daily curation of tech news</p>",
    //         outro: "<p>Thanks for reading! </p> <p>Andrew Pierno</p>"
    //       },
    //     },
    //       { where: { id: project.id } })

    const sources = [
      // sources  may need a prompt to know exactly what to do with them.
      { name: 'Brutalist', type: 'website', meta: { url: 'https://brutalist.report/topic/tech' } },
      // this is being over represented in the newsletter feed.
      { name: "Github Trending Repos", type: 'website', meta: { url: "https://github.com/trending/python?since=weekly" } },
      { name: 'Tldr Tech', type: 'newsletter', meta: { rss: 'https://tldr.tech/api/rss/tech' } },
      { name: 'Tech Crunch', type: 'newsletter', meta: { rss: 'https://techcrunch.com/feed/' } },
      { name: 'Product Hunt', type: 'website', meta: { rss: 'https://www.producthunt.com/feed?category=undefined' } },
      { name: 'Hacker News', type: 'website', meta: { rss: 'https://news.ycombinator.com/rss' } },
      { name: 'The Verge', type: 'website', meta: { rss: 'https://www.theverge.com/rss/index.xml' } },
      { name: 'Wired', type: 'website', meta: { rss: 'https://www.wired.com/feed/category/business/latest/rss' } },
      { name: 'Techmeme', type: 'website', meta: { rss: 'https://www.techmeme.com/feed.xml' } },
    ]
    for (const source of sources) {
      let s = await Source.findOne({ where: { name: source.name, OrgId: org.id, ProjectId: project.id } })
      if (!s) {
        await Source.create({ ...source, OrgId: org.id, ProjectId: project.id })
      }
    }

    const platformExists = await Platform.findOne({ where: { name: 'ghost', ProjectId: project.id } })
    if (!platformExists) {
      await Platform.create({
        name: 'ghost', ProjectId: project.id, type: 'ghost', meta: {
          url: 'https://thecompiler.io',
          contentKey: '55b178bb3d0d3fe341768c65ad',
          adminKey: '67363563fcc9852fbc59e712:7d39717945dc7f54f797f6b6f368a9f3317253af4e4bd199b8de6acdc0f42cf8'
        }
      })
    }
    const twitterPlatform = await Platform.findOne({ where: { name: 'twitter', ProjectId: project.id } })
    const twt = {
      name: 'twitter',
      ProjectId: project.id,
      type: 'twitter',
      meta: { "access": "1546935915355918336-h4VPzQx54m3VjFAM0HJr3xGdTTJDPM", "bearer": "AAAAAAAAAAAAAAAAAAAAAKJEtwEAAAAAMBMdzi0tLRdc7pJqzIjN82yXvGo%3DrBkrHFtJD2xAhyxquSNOQihgovUxt4MSePxLqT68SiY1EqtSUq", "api_key": "Ukeutptl7NGsK2pvA3TiX9a7g", "client_id": "aFFIRzB3N2ZTSnBQRmN2VWlQdEs6MTpjaQ", "api_secret": "DXJjRbzWo1UUovJETtNzn5gtL9Nfl6NQgzizgZC1wsfEJw5CO1", "access_token": "cHVwNjJLTkdZMG5KTDIxbmNsSDlCN205ckFjZ1J5ZnRUYXR3a29KQ2Z6SVdnOjE3MzE3MDI3NjE1MDI6MToxOmF0OjE", "access_secret": "IWDC2ZA49ylVLAQA0UlYtqfuvpD0MEpN39WTiCo4FpxMq", "client_secret": "SRdSRoVQfLewuhX9S69HTMk2Lid798az0rQhwyZMujDnUo18Qn", "refresh_token": "dlV1V1pPUUQ4RmkwY0REbkNHWEwwNnZFTk5TTHdDZXItbUdYNU9WSkUyMEpwOjE3MzE3MDI3NjE1MDI6MTowOnJ0OjE" }
    }
    if (!twitterPlatform) {
      await Platform.create(twt)
    }

    // reddit 
    const redditPlatform = await Platform.findOne({ where: { name: 'reddit', ProjectId: project.id } })
    if (!redditPlatform) {
      await Platform.create({ name: 'reddit', ProjectId: project.id, type: 'reddit', meta: {} })
    }
    // do linkedin 
    const linkedinPlatform = await Platform.findOne({ where: { name: 'linkedin', ProjectId: project.id } })
    const li_data = {
      name: 'linkedin',
      ProjectId: project.id,
      type: 'linkedin',
      meta: { "scope": "r_basicprofile,w_member_social", "user_id": "ukRZ6C9EAX", "expires_in": 5183999, "access_token": "AQVdGuT71ihWJknr5-ms_7tim3fYmiv22HltzUjcgrh9csZ6uZ80tJFOfPfVwGdSSSpVq9cZF9KB5rOHW30wmV0dh6tmXHtwvBKC8jmk12FaI72G_180Bqiz16dwCtHNYzbPpku-lYQDzZZirSSHmkZ0EUV5tf360-V45Fy1r-pQGTRgwI2WswujJcUwlZW1mgaH1nQRN2lNC2fN8RAgh0oq0P3Cz0-X-kAZ1B1fpGuF-b-oFGMo9HgEJ8DnucFYrhFzYbd33IDeTSX1EhfBBwqq5GDS4KB99QKOyYMTzCwdjOOVRohHrfXAbLjoKUv7LLBzeT5DdBpHnY6JeE4198klGxuXNA", "refresh_token": "AQW9AgNjfsgoUAnUBCS9ZwDqBVJi9bOI9h8jVvMxyPGG-DuSs6cHOddFJtbvgy_2K-RNhc69PzJTwkTs67c-1efGyQiRjpJ0VoZ1fAz4yWCXssO3-giKjijCPTBsphfO5vmPuwrBHR6kvWMI_ris7lV6OdWKWebZNVlXllfK3_VL_1R9Rnt_2aXu2JIGszIGcHUZit1WSeE6MsKS_cojZDQLiBBLaf1e7Kcvj80osAQXTOniDIQKEIouZulZFn5dBcjn7sBRrbp8lenoZvXDgyLJBWKezQMmm2EGxdAFbfRThwrleV22t1EdRcPjLNZ-xw82cJfBh-wMjxizvlnFXlF05rIFgQ", "refresh_token_expires_in": 31535999 }
    }
    if (!linkedinPlatform) {
      await Platform.create(li_data)
    }

    // do castos 
    const castosPlatform = await Platform.findOne({ where: { name: 'castos', ProjectId: project.id } })
    if (!castosPlatform) {
      const castos_data = {
        api_key: '3g01n-2y10rQERjFsYjpjLG4K82UIlsO6nYoJ1ZTXSns6U9R0pdsKiJgnsTr2K',
        podcast_id: '62792',
        podcast_name: 'The Compiler',
        intro: 'Welcome to The Compiler, a daily curation of tech news. Let\'s get into it ...',
        outro: 'Thanks for listening. For more, please visit the compiler dot i o.',
        image: 'https://s3.us-east-1.wasabisys.com/supersend/thecompiler/image.jpg'
      }
      await Platform.create({ name: 'castos', ProjectId: project.id, type: 'castos', meta: castos_data })
    }

    // do youtube 
    const youtubePlatform = await Platform.findOne({ where: { name: 'youtube', ProjectId: project.id } })
    if (!youtubePlatform) {
      await Platform.create({ name: 'youtube', ProjectId: project.id, type: 'youtube', meta: {} })
    }
    // do tiktok 
    const tiktokPlatform = await Platform.findOne({ where: { name: 'tiktok', ProjectId: project.id } })
    if (!tiktokPlatform) {
      await Platform.create({ name: 'tiktok', ProjectId: project.id, type: 'tiktok', meta: {} })
    }

  } catch (e) {
    console.log("bootstrap error", e);
  }
}
