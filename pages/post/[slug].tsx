import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
// import { client } from '../api/createcomment'
// import PortableText  from 'react-portable-text'
interface Props {
    post: Post
}

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

const Post = ({ post }: Props) => {
    const [submitted,setSubmitted] = useState(false)
    console.log(post)
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>()


    const onSubmit:SubmitHandler<IFormInput> = async(data) =>{
    fetch("/api/createcomment",{
        method:"POST",
        body:JSON.stringify(data)
    }).then(()=>{
        console.log(data)
    }).catch((err)=>{
        console.log(err)
    })
     console.log('submitted')
    }
     
    return (
        <>
      
            <Header />
            <main className='max-w-3xl mx-auto'>

                <img className='w-full h-40 object-cover ' src={urlFor(post.mainImage).url()} alt="" />

                <article className='max-w-3xl mx-auto p-5'>
                    <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                    <h3 className='text-xl font-light text-gray-500'>{post.description}</h3>
                    <div className='flex items-center space-x-2'>
                        <img className='h-10 w-10 rounded-full' src={urlFor(post.author.image).url()} />
                        <p>Blog post by <span className='text-green-600'>{post.author.name} - published At ("") {new Date(post._createdAt).toLocaleString()}</span></p>
                    </div>
                    <div className='mt-10'>
                        <PortableText
                            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                            content={post.body}
                        />
                    </div>
                </article>
                <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 max-w-2xl mb-10'>
                    <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
                    <h3 className='text-3xl font-bold'>Leave a comment below!</h3>
                    <hr className='py-3 m-2' />
                    <input
                        {...register("_id")}
                        type="hidden"
                        name="_id"
                        value={post._id}
                    />
                    <label className='block mb-5'>  
                        <span className='text-gray-700'>Name</span>
                        <input  {...register("name",{required:true})} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500' placeholder='John ' type="text" />
                    </label>
                    <label className='block mb-5'>
                        <span className='text-gray-700'>Email</span>
                        <input {...register("email",{required:true})} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500' placeholder='John ' type="email" />
                    </label>
                    <label className='block mb-5'>
                        <span className='text-gray-700'>Comment</span>  
                        <textarea   {...register("comment",{required:true})} className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' placeholder='John' rows={8}/>
                    </label>

                    <div className='flex flex-col p-5'>
                        {errors.name && (
                            <span className='text-red-500'>The Name Field is Required</span>
                        )
                        }
                        {errors.comment && (
                            <span className='text-red-500'>Comments Field is Required</span>
                        )
                        }
                        {errors.email && (
                            <span className='text-red-500'>Email Field is Required</span>
                        )
                        } 
                    </div>
                    <input type="submit" className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'/>
                </form>
            </main>
            <main>
                {/* <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow'>
                    <h3 className='text-4xl'>Comments</h3>
                    <hr className='pb-2'/>
                    {post.comments.map((Comment)=>{
                      <div key={Comment._id}>
                          <p>
                              <span className='text-yellow-500'>{Comment.name} :</span>
                              {Comment.comment}
                          </p>
                      </div>
                    })}
                </div> */}
            </main>
        </>
    )
}
export default Post

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
    _id,
    slug{
        current
    }

   }
      
   `
    const posts = await sanityClient.fetch(query)

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }));
    return {
        paths,
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author->{  
            name,
            image
        },
        'comments':*[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true
        ],
        description,
        mainImage,
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    });
    if (!post) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            post
        }
    }
}