import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import {config,sanityClient,urlFor} from '../sanity'
import { Post } from '../typings'

interface Props{
  posts:[Post]
}

const Home = ({posts}:Props) =>{  
  console.log(posts)
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5'>    
          <h1 className='text-6xl max-w-xl font-serif'> <span className='underline decoration-black decoration-4'>Blugg </span>is a place to write read and connect</h1>
          <h2>
            Its easy and free to post your thinking on any topic and connect with millions of readers
          </h2>  
        </div>
        <img className='hidden md:inline h-32 lg:h-full' src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"/>
      </div>
      {/* posts */}  
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6 overflow-hidden '>
        {posts.map(post=>(
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer rounded-lg border'>
               <img src={urlFor(post.mainImage).url()} className='w-full h-60 object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'/>
               <div className='flex justify-between p-5 bg-white'>
                 <div>
                   <p className='text-lg font-bold'>{post.title}</p>
                   <p>{post.description} by {post.author.name}</p>
                 </div>
                 <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()}/>  
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div> 
  )
}

export default Home
export const getServerSideProps = async () =>{
  const query = `*[_type == "post"]{
    _id,
    title,
    author->{
      name,
      image
    },   
    description,
    mainImage,
    slug
  }`
  const posts = await sanityClient.fetch(query)
  return {
    props:{
      posts
    }
  }
}
