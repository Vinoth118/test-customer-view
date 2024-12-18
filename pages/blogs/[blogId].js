import React from "react";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/landing/Footer";
import ReactMarkdown from "react-markdown";

import { useRouter } from "next/router";
export default function BlogDetail({ blog, settings }) {
  const router = useRouter();


  return (
    <>
      <div className="bg-white">
        <title>{settings.siteTitle}</title>
        <meta name="description" content={blog.seoDescription} />
        <meta name="keywords" content={blog.seoKeywords} />
        <meta name="title" content={blog.seoTitle} />
        <meta name="thumbnail" content={blog.coverImage} />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://csc-landing-test.netlify.app/"
        />
        <meta property="og:title" content={settings.seoTitle} />
        <meta property="og:description" content={settings.seoDescription} />
        <meta property="og:image" content={settings.Thumbnail} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://csc-landing-test.netlify.app/"
        />
        <meta property="twitter:title" content={settings.seoSiteTitle} />
        <meta
          property="twitter:description"
          content={settings.seoDescription}
        />
        <meta property="twitter:image" content={settings.Thumbnail} />
      </div>

      <div className="md:w-3/4 flex flex-col md:mx-auto mt-24 mx-5">
        <img
          src={blog.coverImage}
          alt={blog.blogTitle}
          className="object-fill mt-6 rounded-lg items-center mx-auto"
        />

        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="md:text-3xl text-2xl font-semibold mt-4">
              {blog.blogTitle}
            </h1>
          </div>

          <div className="flex flex-col space-y-10 mt-4">
            <div className="flex flex-col items-start">
              <div className="text-gray-700 mt-">
                {" "}
                <ReactMarkdown>{blog.blogContent}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        <Header settings={settings} />
        <Footer settings={settings} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const blogId = params.blogId;

  try {
    // Fetch blog details
    const blogResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/landing/blog/${blogId}`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );
    const blog = blogResponse.data.data;

    // Fetch additional settings
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
        blog,
        settings,
      },
    };
  } catch (error) {
    console.error("Error fetching blog details:", error);

    return {
      notFound: true,
    };
  }
}
