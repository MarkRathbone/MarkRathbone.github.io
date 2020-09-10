import { BlogBuilder } from "../components/blog/BlogBuilder";
const bloglist = [];

const blog = new BlogBuilder({
  title: "How I learned Terraform",
  image: "https://i.imgur.com/wl663oz.png",
  description:
    "This is a quick blog post explaining how I managed to teach myself Terraform!",
})
  .addHeading("Why?")
  .addParagraph(
    "During AWS re/Start there were somethings we didn't have the time to cover, and although they're very important in reality, they aren't AWS Services so they aren't covered all too much, other than in 'You should know this exists' sense, and James also emphasised the importance of them. Having looked at a few job openings I had also saw a few things popping up over and over again: Terraform and Ansible being two of those."
  )
  .addHeading("Starting Point")
  .addParagraph(
    "My starting point was simple: Go to the websites. These both had some very nice websites that quite concisely tell you what the tools do but I wanted more, so I went to YouTube. IBM cloud has a number of strong and well presented videos on AWS that I would highly recommend. There were a couple of things I wanted to know coming out of this: why they exist, what they do, and actual use case scenarios."
  )
  .addHeading("Hashicorp Configuration Language")
  .addParagraph("Just like with every other language there was a coding language to learn called HCL (Hashicorp Configuration Language) - which I honestly didn't find too bad. Once again I sat on YouTube and followed along with a video showing how to set up an AWS Infrastructure with a basic web server through Terraform. It was useful - after troubleshooting my mistakes and getting it working, I had a new project I wanted to do. Earlier in the course, when we had first been learning about AWS, I took the time to setup a small Terraria world server in AWS, nothing major or fancy - but something practical and useful for me in the future. I wanted to try setting up that same infrastructure in Terraform now.\n Now that I had the skills to use HCL at a basic level, there were some more things I wanted to find solutions to that weren't covered in the video I watched:\n The video had hard-coded AWS Credentials, which is a major security concern for anything that might be uploaded in the future.\n It had not used variables whatsoever.\n Userdata wouldn't be enough for what I wanted to do, I would also have to learn Ansible and how to deploy it through Terraform."
  );

const blog1 = new BlogBuilder({
  title: "My Second Blog",
  image: "img",
  description:
    "Description Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure tempore aut neque consectetur voluptatem quam nihil, facere earum adipisci, animi beatae dicta maiores, ipsam delectus ab molestias dolorum aperiam? Sapiente?",
})
  .addHeading("Terrarform")
  .addParagraph(
    "1st Paragraph Aspernatur vero reiciendis quas, autem sit culpa? Quibusdam, cupiditate voluptate a non nulla aliquid enim doloremque ullam, facilis quisquam similique hic omnis!"
  )
  .addParagraph(
    "2nd Paragraph Consequuntur ad, temporibus quae obcaecati eum expedita pariatur aspernatur recusandae beatae iste soluta sunt blanditiis dolore ipsam quia laboriosam quas perspiciatis architecto?"
  )
  .addHeading("New Heading")
  .addParagraph(
    "1st Paragraph Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur vero reiciendis quas, autem sit culpa? Quibusdam, cupiditate voluptate a non nulla aliquid enim doloremque ullam, facilis quisquam similique hic omnis!"
  )
  .addParagraph(
    "2nd Paragraph Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur ad, temporibus quae obcaecati eum expedita pariatur aspernatur recusandae beatae iste soluta sunt blanditiis dolore ipsam quia laboriosam quas perspiciatis architecto?"
  );

bloglist.push(blog1);
bloglist.push(blog);

export default bloglist;
