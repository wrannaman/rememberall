import { pg } from '../../connections/index.js'
import { TwitterApi } from 'twitter-api-v2'
import { google } from 'googleapis';
import { z } from 'zod'
import milvus from '../../connections/milvus.js'
import { DataType } from '@zilliz/milvus2-sdk-node'
import OpenAI from 'openai'
import getCollectionName from '../../utils/getCollectionName.js'

const OAuth2 = google.auth.OAuth2;

const castosSchema = z.object({
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

export const createMemory = async (req, res) => {
  try {
    console.log('createMemory', req.body)
    const { memory } = req.body
    // index into milvus 
    const collection = await milvus.hasCollection({ collection_name: getCollectionName(req.user.OrgId) })
    console.log("collection:", collection)
    if (!collection.value) {
      const createdCollection = await milvus.createCollection({
        collection_name: getCollectionName(req.user.OrgId),
        fields: [
          {
            name: 'id',
            description: 'ID field',
            data_type: DataType.Int64,
            is_primary_key: true,
            autoID: true,
          },
          {
            name: 'memory',
            description: 'Memory field',
            data_type: DataType.VarChar,
            max_length: 5000,
          },
          {
            name: 'vector',
            description: 'Vector field',
            data_type: DataType.FloatVector,
            dim: 3072,
          },
        ],
      })
      console.log("createdCollection:", createdCollection)
    }
    // get the vector from openai using the users Org.openai_api_key and openai_url 
    const openai = new OpenAI({
      apiKey: req.user.Org.openai_api_key,
      baseURL: req.user.Org.openai_url,
    })
    const vector = await openai.embeddings.create({
      input: memory,
      model: "text-embedding-3-large",
    })
    console.log("vector:", vector?.data[0]?.embedding?.length)
    const inserted = await milvus.insert({
      collection_name: getCollectionName(req.user.OrgId),
      data: [{
        vector: vector?.data[0]?.embedding,
        memory: memory
      }]
    })
    console.log("inserted:", inserted)
    // await milvus.insertEntity(memory.id, memory.memory)
    return res.json({ success: true, memory })
  } catch (e) {
    console.log("create memory error", e)
    return res.status(500).json({ error: 'Failed to create memory' })
  }
}

export const getMemories = async (req, res) => {
  try {
    let { search, limit = 10, offset = 0 } = req.query
    if (typeof limit === 'string') limit = parseInt(limit)
    if (typeof offset === 'string') offset = parseInt(offset)
    console.log("search:", search, "limit:", limit, "offset:", offset)

    const name = getCollectionName(req.user.OrgId)
    const collectionExists = await milvus.hasCollection({
      collection_name: name
    })

    if (!collectionExists.value) {
      return res.json({ success: true, memories: [] })
    }

    // Check if index exists, if not create it
    const index = await milvus.describeIndex({
      collection_name: name,
      field_name: 'vector'
    })
    if (index?.status?.error_code === 'IndexNotExist') {
      // Create index if it doesn't exist
      await milvus.createIndex({
        collection_name: name,
        collection_name: name,
        field_name: 'vector',
        index_type: 'IVF_FLAT',
        metric_type: 'L2',
        params: { nlist: 1024 }
      })
      console.log("Created new index for collection")
      const nowExist = await milvus.describeIndex({
        collection_name: name,
        field_name: 'vector'
      })
    }

    // Load collection before querying
    await milvus.loadCollection({
      collection_name: name
    })

    if (search) {
      const openai = new OpenAI({
        apiKey: req.user.Org.openai_api_key,
        baseURL: req.user.Org.openai_url,
      })
      const vector = await openai.embeddings.create({
        input: search,
        model: "text-embedding-3-large",
      })
      console.log('got vector', vector?.data[0]?.embedding?.length);

      let memories = await milvus.search({
        collection_name: name,
        vector: vector?.data[0]?.embedding,
        top_k: parseInt(limit)
      })
      memories.results = memories.results.map(r => ({
        score: r.score,
        id: r.id,
        memory: r.memory
      }))
      console.log("memories:", memories)
      return res.json({ success: true, memories })
    }

    const memories = await milvus.query({
      collection_name: name,
      output_fields: ['memory'],
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    return res.json({ success: true, memories: memories.data })
  } catch (e) {
    console.log("get memories error", e)
    return res.status(500).json({ error: 'Failed to get memories' })
  }
}

export const deleteMemory = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(404).json({ error: 'Memory not found' })
  console.log("id:", id)
  const del = await milvus.delete({
    collection_name: getCollectionName(req.user.OrgId),
    ids: [id]
  })
  console.log("del:", del)
  return res.json({ success: true })
}

export const getProject = async (req, res) => {
  const { Project, Source, Platform } = pg.models
  const project = await Project.findOne({ where: { id: req.params.id, OrgId: req.user.OrgId } })
  if (!project) return res.status(404).json({ error: 'Project not found' })
  const sources = await Source.findAll({ where: { ProjectId: project.id }, order: [['createdAt', 'DESC']] })
  const platforms = await Platform.findAll({ where: { ProjectId: project.id }, order: [['createdAt', 'DESC']] })
  return res.json({ success: true, project, sources, platforms })
}

export const listCollections = async (req, res) => {
  try {
    const collections = await milvus.listCollections()
    return res.json({ success: true, collections })
  } catch (e) {
    console.log("list collections error", e)
    return res.status(500).json({ error: 'Failed to list collections' })
  }
}

// setTimeout(async () => {

//   const { Project, Platform } = pg.models
//   const ProjectId = '33d39951-358c-49e6-b1cb-7fb395fb5f9b'
//   // const project = await Project.findOne({ where: { id: ProjectId } })
//   const platforms = await Platform.findAll({ where: { ProjectId } })
//   const yt = platforms.find(p => p.type === 'youtube')
//   const youtubeData = await getYouTubeAnalytics(yt.meta);
// }, 2000)
