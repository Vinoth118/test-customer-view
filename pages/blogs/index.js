import React from "react";
import axios from "axios";
import Header from "@/components/Header";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
export default function Blog({ blogs, settings }) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <Header settings={settings} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Learn how to grow your business with our expert advice.
          </p>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {blogs.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <Link href={`/blogs/${post.id}`} passHref>
                  <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                    <img
                      src={post.coverImage}
                      alt=""
                      className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                </Link>
                <div>
                  {post.tags && (
                    <div className="flex items-center text-xs">
                      <time dateTime={post.datetime} className="text-gray-500">
                        {post.date}
                      </time>

                      <div className=" flex flex-wrap">
                        {Array.isArray(post.tags)
                          ? post.tags.map(
                            (tag, index) =>
                              tag.trim() && (
                                <div
                                  key={index}
                                  className="relative z-10 rounded-full bg-gray-100 px-4 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                >
                                  <span className="mr-1">{tag.trim()}</span>
                                </div>
                              )
                          )
                          : post.tags.split(",").map(
                            (tag, index) =>
                              tag.trim() && (
                                <div
                                  key={index}
                                  className="relative z-10 rounded-full bg-gray-100 px-4 mx-1 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                >
                                  <span className="mr-1">{tag.trim()}</span>
                                </div>
                              )
                          )}
                      </div>
                    </div>
                  )}
                  <div className="group relative max-w-xl">
                    <Link href={`/blogs/${post.id}`} passHref>
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <span className="absolute inset-0" />
                        {post.blogTitle}
                      </h3>
                      <div className="mt-5 text-sm leading-6 text-gray-600 line-clamp-6">
                        <ReactMarkdown>{post.blogContent}</ReactMarkdown>
                      </div>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const blogResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/landing`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );
    const blogs = blogResponse.data.data.blogs;

    const settingsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/landing`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );
    const settings = settingsResponse.data.data.settings;

    return {
      props: {
        blogs,
        settings,


      },
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      props: {
        blogs: [],
        settings
      },
    };
  }
}
