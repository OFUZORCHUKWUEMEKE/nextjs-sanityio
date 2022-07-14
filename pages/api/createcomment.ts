// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'

type Data = {
  name: string
}

const config = {
  dataset:process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn:process.env.NODE_ENV === "production",
  token:process.env.SANITY_API_TOKEN,
  apiVersion: '2021-08-31'
}

const client = sanityClient(config)

export default async function createcomment(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) { 
  const {_id,name,email,comment} = JSON.parse(req.body)
  try {
    await client.create({
      _type:'comment',
      post:{
        _type:'reference',
        _ref:_id
      },
      name,
      email,
      comment
    })
    console.log('submitted')  
  } catch (error) {
     console.log(error)  
  }
  console.log('submitted')
}
