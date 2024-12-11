import { z } from 'zod'


export const PLATFORM_TYPES = ['ghost', 'tiktok', 'twitter', 'youtube', 'linkedin', 'substack', 'email', 'castos'];


// sources 

export const SOURCE_TYPES = ['website', 'newsletter', 'castos'];

export const castosSchema = z.object({
  name: z.string(),
  type: z.literal('castos'),
  meta: z.object({
    image: z.string(),
    intro: z.string(),
    outro: z.string(),
    api_key: z.string(),
    podcast_id: z.string(),
    podcast_name: z.string(),
  })
})
// the website type has a name, type='website', and meta has a url OR an rss feed but not both
export const websiteSchema = z.object({
  name: z.string(),
  type: z.literal('website'),
  meta: z.object({
    url: z.string().optional(),
    rss: z.string().optional(),
  })
})

// newsletter is same as rss but type = newsletter. we need this bc we have logic to scrape most recent post. but it must have rss
export const newsletterSchema = z.object({
  name: z.string(),
  type: z.literal('newsletter'),
  meta: z.object({
    rss: z.string(),
  })
})


