import { Clapperboard, MessageSquareCode, Headphones, SportShoe, FileText } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa6';

export const CONNECT_DATA = {
  profile: {
    name: "Vanshjeet Singh",
    title: "Technical Product Engineer & Architect",
    location: "Bengaluru",
    image: "/Vansh.jpeg"
  },
  about: {
    header: "About Me",
    headline: "I like cool things.",
    paragraphs: [
      "I'm Vansh, I like learning new things, building things and solving problems",

      "I think my strength would be that I understand logic very well. I like to understand the working of something and I get very determined to become good at it."
    ]
  },
  hobbies: {
    header: "Hobbies & Interests",
    items: [
      { title: 'Sports', 
        desc: 'Footbal, Tennis, Basketball(just NBA)',
        icon: SportShoe },
      { title: 'Movies', 
       desc: 'Whole lot of Cinema, TV and anime', 
       icon: Clapperboard } ,
      { title: 'Audiophile & Sound', 
        desc: 'Alternate Rock, Hip Hop and Soundtracks', 
        icon: Headphones },
      { title: 'Agentic AI', 
        desc: 'Trying to understand the capabilities of  AI and how to make something meaningul with it.', 
        icon: MessageSquareCode }
    ]
  },
  links: {
    header: "Connect Links",
    items: [
      { 
        name: 'GitHub', 
        label: 'github.com/vanshjeet786', 
        href: 'https://github.com/vanshjeet786', 
        icon: FaGithub,
        hoverBg: 'group-hover/link:bg-white/20 group-hover/link:border-white/60 group-hover/link:shadow-[0_0_16px_rgba(255,255,255,0.4)]',
        hoverIcon: 'group-hover/link:text-white group-hover/link:scale-125 group-hover/link:-rotate-12'
      },
      { 
        name: 'LinkedIn', 
        label: 'linkedin.com/in/vanshjeetsingh', 
        href: 'https://www.linkedin.com/in/vanshjeet', 
        icon: FaLinkedin,
        hoverBg: 'group-hover/link:bg-[#0A66C2]/20 group-hover/link:border-[#0A66C2]/60 group-hover/link:shadow-[0_0_16px_rgba(10,102,194,0.5)]',
        hoverIcon: 'group-hover/link:text-[#0A66C2] group-hover/link:scale-125 group-hover/link:rotate-12'
      },
      { 
        name: 'Mail', 
        label: 'singhvanshjeet@gmail.com', 
        href: 'mailto:singhvanshjeet@gmail.com', 
        icon: FaEnvelope,
        hoverBg: 'group-hover/link:bg-[#c8a68a]/20 group-hover/link:border-[#c8a68a]/60 group-hover/link:shadow-[0_0_16px_rgba(200,166,138,0.5)]',
        hoverIcon: 'group-hover/link:text-[#c8a68a] group-hover/link:scale-125 group-hover/link:-translate-y-1'
      },
      { 
        name: 'Instagram', 
        label: '@vanshjeetsingh', 
        href: 'https://instagram.com/vanshjeetsingh', 
        icon: FaInstagram,
        hoverBg: 'group-hover/link:bg-[#E4405F]/20 group-hover/link:border-[#E4405F]/60 group-hover/link:shadow-[0_0_16px_rgba(228,64,95,0.5)]',
        hoverIcon: 'group-hover/link:text-[#E4405F] group-hover/link:scale-125 group-hover/link:rotate-12'
      }
    ]
  },
  resume: {
    name: "Curriculum Vitae",
    label: "View / Download Resume",
    href: "/resume.pdf",
    icon: FileText
  }
};
