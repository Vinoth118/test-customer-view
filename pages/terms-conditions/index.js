import axios from "@/utils/axios";
import Link from "next/link";

export default function Terms({ settings }) {
  return (
    <>
      <div className="flex flex-col">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            className="mx-auto flex max-w-7xl items-center justify-between p-5 lg:px-8"
            aria-label="Global"
          >
            <Link href="/" className="-m-1.5 p-1.5">
              {settings && settings.logo && (
                <img
                  className="h-24 w-auto"
                  src={settings.logo}
                  href="/"
                  alt=""
                />
              )}{" "}
            </Link>
          </nav>
        </header>
        <div className="mx-auto flex flex-col max-w-7xl mt-40 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          <div className="whitespace-pre-wrap mt-10">
These Terms of Service (“Terms”) are a contract between you and Corporate Sports Club Pvt. Ltd. (“Corporate Sports Club”) located at No 166, IInd floor, D block, R.V. Nagar main road, Annanagar East, Chennai, Tamil Nadu 600102. They govern your use of Corporate Sports Club App, Websites, Services, Products, and Content (“Services”).<br></br>
Corporate Sports Club (CSC)is the owner of the website domain at https://corporatesportsclub.in / and mobile application “Corporate Sports Club (CSC)- engagement App” on various App stores.<br></br>
By using Corporate Sports Club (CSC), you agree to these Terms. If you don’t agree to any of the Terms, you can’t use Corporate Sports Club (CSC).<br></br>
We can change these Terms at any time. By using Corporate Sports Club (CSC)on or after that effective date, you agree to the new Terms.<br></br>
Content rights & responsibilities<br></br>
By scoring matches and tournaments on Corporate Sports Club (CSC), you give us a nonexclusive license to publish them on Corporate Sports Club (CSC) platform (website, apps, etc.) including anything reasonably related to publishing it (like storing, displaying, reformatting, aggregating, and distributing it). In consideration for Corporate Sports Club (CSC) granting you access to and use of the platform, you agree that Corporate Sports Club (CSC) may enable advertising on the platform, including in connection with the display of your content or other information. We may also use your content to promote Corporate Sports Club (CSC)and sell premium features by aggregating, normalising and enriching your scores.<br></br>
<br></br>
Our content and services<br></br>
We reserve all rights in Corporate Sports Club (CSC) look and feel. Some parts of Corporate Sports Club (CSC) are licensed under third-party open source licenses. We also make some of our own code available under open source licenses. As for other parts of Corporate Sports Club (CSC), you may not copy or adapt any portion of our code or visual design elements (including logos) without express written permission from Corporate Sports Club (CSC) unless otherwise permitted by law.<br></br>
<br></br>
You may not do, or try to do, the following: (1) access or tamper with non-public areas of the Services, our computer systems, or the systems of our technical providers; (2) access or search the Services by any means other than the currently available, published interfaces (e.g., APIs) that we provide; (3) forge any TCP/IP packet header or any part of the header information in any email or posting, or in any way use the Services to send altered, deceptive, or false source-identifying information; or (4) interfere with, or disrupt, the access of any user, host, or network, including sending a virus, overloading, flooding, spamming, mail-bombing the Services, or by scripting the creation of content or accounts in such a manner as to interfere with or create an undue burden on the Services.<br></br>
<br></br>
Crawling the Services is allowed if done in accordance with the provisions of our robots.txt file, but scraping the Services is prohibited.<br></br>
<br></br>
We may change, terminate, or restrict access to any aspect of the service, at any time, without notice.<br></br>
<br></br>
Incorporated rules and policies<br></br>
By using the Services, you agree to let Corporate Sports Club (CSC)collect and use information as detailed in our Privacy Policy. If you’re outside the Republic of India, you consent to letting Corporate Sports Club (CSC) transfer, store, and process your information (including your personal information and content) in and out of the Republic of India.<br></br>
<br></br>
By using Corporate Sports Club (CSC), you agree to follow these Rules and Policies. If you don’t, we may remove content, or suspend or delete your account.<br></br>
<br></br>
Use of Intellectual Property<br></br>
By using the Services, you agree to provide Corporate Sports Club (CSC) with all permissions and rights necessary for the limited use of your Intellectual Property including, but not limited to, your Trademark, Tradename, Logos, etc., towards the provision of the Services.<br></br>
<br></br>
Miscellaneous<br></br>
Disclaimer of warranty. Corporate Sports Club (CSC) provides the Services to you as is. You use them at your own risk and discretion. That means they don’t come with any warranty. None express, none implied. No implied warranty of merchantability, fitness for a particular purpose, availability, security, title or non-infringement.<br></br>
<br></br>
Limitation of Liability. Corporate Sports Club (CSC) won’t be liable to you for any damages that arise from your using the Services. This includes if the Services are hacked or unavailable. This includes all types of damages (indirect, incidental, consequential, special or exemplary). And it includes all kinds of legal claims, such as breach of contract, breach of warranty, tort, or any other loss.<br></br>
<br></br>
No waiver. If Corporate Sports Club (CSC) doesn’t exercise a particular right under these Terms, that doesn’t waive it.<br></br>
<br></br>
Severability. If any provision of these terms is found invalid by a court of competent jurisdiction, you agree that the court should try to give effect to the parties’ intentions as reflected in the provision and that other provisions of the Terms will remain in full effect.<br></br>
<br></br>
Choice of law and jurisdiction. These Terms are governed by Indian Laws, without reference to its conflict of laws provisions. You agree that any suit arising from the Services must take place in a court located in Ahmedabad, Gujarat.<br></br>
Entire agreement. These Terms (including any document incorporated by reference into them) are the whole agreement between Corporate Sports Club (CSC) and you concerning the Services.<br></br>
Grievance Redressal<br></br>
Any discrepancies or grievances with regard to content and or comment or breach of these Terms shall be taken up with the designated Grievance Officer as mentioned below via in writing or through email signed with the electronic signature to:<br></br>
Name: Pratheep<br></br>
Email ID: pratheep@corporatesportsclub.in<br></br>
<br></br>
Address: No 166, IInd floor, D block, R.V. Nagar main road, Annanagar East, Chennai, Tamil Nadu 600102<br></br>
Any issue raised with the designated Grievance Officer shall be acknowledged within forty-eight (48) hours of raising such issue. Corporate Sports Club (CSC) will resolve the grievance within one (1) month of the original communication.<br></br>
<br></br>
Customer Support<br></br>
If you have any questions regarding the Services, please contact Corporate Sports Club (CSC)at +91 98840 68064. Please note that you shall be required to provide information (including, but not limited to contact number or registered mobile number, etc.) for the purpose of validation and taking your service request.<br></br>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/user/landing`,
      {
        headers: {
          cookie: context.req.headers.cookie,
        },
      }
    );
    const testimonials = response.data.data.testimonials;
    const cities = response.data.data.cities;
    const settings = response.data.data.settings;
    const gallery = response.data.data.settings.gallery;
    const events = response.data.data.events;
    const clients = response.data.data.settings.clients;
    const imageCarousel = response.data.data.settings.imageCarousel;
    const sponsorLogos = response.data.data.settings.sponsorLogos || [];
    console.log(settings.data);

    return {
      props: {
        testimonials: testimonials,
        cities,
        settings,
        gallery,
        events,
        clients,
        imageCarousel,
        sponsorLogos,
        isAuthenticated: response.data.isAuthenticated,
      },
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      props: {
        testimonials: [],
      },
    };
  }
}
