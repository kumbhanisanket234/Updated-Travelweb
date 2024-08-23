import React from 'react'
import { Blogscontain } from './Blogscontain'

function Blog() {
    const blogtitle = localStorage.getItem('blogtitle');
    return (
        <div className='blog'>
            {Blogscontain.map((items, index) => (
                items.title == blogtitle &&
                <div key={index}>
                    <h1 className='Blogs-desc text-center'>{items.title}</h1>
                    <div className='blog-img'>
                        <img src={items.img} alt="" />
                    </div>
                    <p>{items.description}</p>
                </div>
            ))}
        </div>
    )
}

export default Blog
