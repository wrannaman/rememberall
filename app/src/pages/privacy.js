import Head from 'next/head'
import { marked } from 'marked'


const markdown = `
# Privacy Policy

**Last Updated: 8/14/2024**

Welcome to OnSched, a platform designed to empower you to take control of your health data. Your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, and share your information when you use our services.

## 1. Data Collection and Use

**Personal Information:**  
OnSched collects personal information that you voluntarily provide when you use our services. This may include health-related data such as weight, steps, sleep patterns, heart rate, and other biometric data.

**Purpose:**  
The primary purpose of collecting your health data is to empower you with the tools and insights necessary to manage and improve your health. We may also use your data to enhance our services, provide customer support, and improve user experience.

## 2. Data Sharing

**Your Privacy, Our Priority:**  
We do not share your personal data with any third parties without your explicit permission. Your health data remains private and under your control at all times.

**Third-Party Access:**  
In some cases, third-party companies may request access to your data through our platform. These third parties may include organizations conducting clinical trials or other health-related research. However, no access to your data will be granted without your explicit consent. You will always have the choice to approve or deny any third-party request for your data.

## 3. Third-Party Services

**Collaboration with Third Parties:**  
We may work with third-party companies that wish to use our platform to collect health data from their users. These companies might contract with us to bring their users onto the OnSched platform for purposes such as participating in clinical trials or other health studies. However, no data will be shared with these third parties without your clear, informed, and explicit consent.

## 4. Data Security

**Protecting Your Data:**  
We take the security of your data seriously. We implement a variety of security measures to protect your personal information from unauthorized access, disclosure, or misuse.

## 5. Your Rights

**Control Over Your Data:**  
You have the right to access, update, or delete your personal data at any time. You can also withdraw your consent for data sharing at any time, and we will immediately cease sharing your data with third parties.

## 6. Changes to This Privacy Policy

**Updates:**  
We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any significant changes by posting the updated policy on our website.

## 7. Contact Us

**Questions or Concerns:**  
If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at [your contact email].

---

**By using OnSched, you agree to this Privacy Policy.**

`


export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy - OnSched</title>
        <meta name="description" content={"OnSched Privacy Policy"} />
        <meta name="keywords" content={`API, Healthcare`} />
      </Head>
      <div className="prose bg-white m-auto lg:px-8 pb-32">
        <div className=" mx-auto max-w-3xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-rose-600">Privacy</p>
          <div className='' dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
        </div>
      </div>
    </>
  )
}
