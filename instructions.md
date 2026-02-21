You are a full-stack AI developer.

Build a **visually stunning, one-page portfolio website** in **JavaScript / Next.js** that can be deployed on **Vercel**, following modern UI/UX best practices.

Requirements:

🎨 **Design & UX**
- A beautiful, responsive one-page layout with distinct sections (Hero, About, Projects, AI Interaction, Contact).
- Follow best practices for one-page website flow: striking hero, clear section transitions, smooth scroll, subtle micro interactions, and mobile-first design.
- Use Tailwind CSS for styling and theme support (light/dark modes).
- Use modern animation libraries (e.g., Framer Motion) for hover effects, scroll reveals, and subtle motion.

📁 **Content Sections**
1. **Hero Section**
   - Eye-catching title with my name and tagline.
   - Background animation or visual to create a strong first impression.

2. **About/Resume Section**
   - Automatically extract content from a local file `resume.html` in the project folder.
   - Display clean layout of skills, experience, interests.

3. **Projects Section**
   - A grid/list of projects with image thumbnails.
   - On hover, lightly animate and show basic project information.
   - For each project/section area, define a custom set of questions like:
       • “What did I learn here?”
       • “Tell me a fun fact about this project”
       • “Recruiter-friendly summary”
   - These questions will be used to trigger AI queries about that section.

🤖 **AI Interaction Section**
- A main input where visitors can ask questions about me.
- Suggested question buttons (“What’s my background?”, “Tell a funny story about my work experience”, etc.).
- When a question is selected or typed and submitted:
    • Query a server API endpoint (`/api/ask`)
    • That endpoint performs a local **RAG lookup** using **SQLite** with local data files in the project.
    • Use that retrieved context + question to call an LLM (OpenAI / Vercel AI SDK or equivalent).
    • Stream the response back to the user in real time with a playful, light-hearted voice that sometimes makes recruiters smile.
    • Support streaming output in the UI instead of waiting for full response.

⚙️ **AI Backend Endpoint**
- Implement a Next.js API route at `/api/ask`.
- It should:
    • Accept a question string
    • Perform a **RAG retrieval** on a **local SQLite** database storing embeddings or text chunks
    • Construct a prompt with the retrieved content
    • Call a large language model (via Vercel AI SDK or openAI SDK)
    • Stream the response to the client
- Make sure to handle sanitization of input and streaming reliability.

💡 **AI UX Enhancements**
- When users hover over a section of the page, show custom relevant questions they could ask about that section.
- Show contextual suggestions as overlays or tooltips.
- Make responses conversational but anchored in factual information from resume & project data.

📦 **Project Structure & Deployment**
- Use Next.js App Router.
- Provide clear folder structure with components, hooks, and utility modules.
- Include a `vercel.json` config (or instructions) for deployment.
- Provide environment variable instructions:
    • AI API key
    • Database path
    • Any others

📄 **Deliverables**
- All necessary code files (no tests needed).
- Comments where appropriate, especially around the RAG code logic and streaming pipeline.

The UI should be elegant, interactive, and easy to navigate. The AI assistant should feel playful yet informative, giving the recruiter a unique, delightful experience.