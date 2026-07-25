import { Sparkles, Code, Headphones, User, Github, Linkedin, Mail, Instagram, FileText } from 'lucide-react';

export const CONNECT_DATA = {
  profile: {
    name: "Vanshjeet Singh",
    title: "Product Engineer & Architect",
    location: "Remote / Global",
    image: "/My_Photo.png"
  },
  about: {
    header: "About Me",
    headline: "Engineering Systems That Feel Magic.",
    paragraphs: [
      "I'm Vansh, a Full-Stack Product Engineer passionate about high-throughput distributed systems, real-time message fabrics, and ultra-fluid interactive web experiences.",
      "From building multi-layered AI career counseling engines for Skitre.AI to engineering idempotent WebSocket architectures and GPU-accelerated canvas surfaces, I focus on merging deep technical rigor with state-of-the-art aesthetics."
    ],
    tags: [
      { label: "Realtime Systems", icon: Sparkles },
      { label: "AI Models", icon: Code },
      { label: "Audiophile", icon: Headphones }
    ]
  },
  hobbies: {
    header: "Hobbies & Personal Crafts",
    items: [
      { title: 'High-Craft UI', desc: 'GPU-accelerated canvases, GSAP, & glassmorphism', icon: Sparkles },
      { title: 'Realtime Architecture', desc: 'WebSockets, Redis Pub/Sub, & strict idempotency', icon: Code },
      { title: 'Audiophile & Sound', desc: 'IEM acoustics, soundscapes, & procedural audio', icon: Headphones },
      { title: 'AI Counseling Models', desc: 'RIASEC, Big 5, & multi-layer graph evaluation', icon: User }
    ]
  },
  links: {
    header: "Connect Links",
    items: [
      { name: 'GitHub', label: 'github.com/vanshjeet786', href: 'https://github.com/vanshjeet786', icon: Github },
      { name: 'LinkedIn', label: 'linkedin.com/in/vanshjeetsingh', href: 'https://www.linkedin.com/in/vanshjeet', icon: Linkedin },
      { name: 'Mail', label: 'singhvanshjeet@gmail.com', href: 'mailto:singhvanshjeet@gmail.com', icon: Mail },
      { name: 'Instagram', label: '@vanshjeetsingh', href: 'https://instagram.com/vanshjeetsingh', icon: Instagram }
    ]
  },
  resume: {
    name: "Curriculum Vitae",
    label: "View / Download Resume",
    href: "/resume.pdf",
    icon: FileText
  }
};
