### Product Specification: "Reel-Style" Experience

#### Navigation Mechanics (The Reel Effect)
- **Full-Viewport Sections:** Every component must take exactly `100vh` and `100vw`.
- **Scroll Snapping:** Implement `scroll-snap-type: y mandatory`.
- **Discrete Transitions:** Use a "Scroll Lock" logic. When a user scrolls, the page slides exactly one section (100% height) and locks until the transition animation is complete. This forces the user to view the full image and text before continuing.

### Behavior & Visual Style
- **Sticky Overlay:** The menu remains hidden during the initial Hero video and fades in as a sticky header only after the user scrolls past the first 100vh frame.
- **High-End Minimalist Aesthetic:** Following a "Zara-style" approach, use large, elegant typography (Serif for primary links) with high contrast and **no background** to maintain focus on the full-screen photography.
- **Adaptive Contrast:** Implement a subtle text-shadow or a dynamic contrast filter to ensure legibility as background images change during the "reel-style" scroll.

### Menu Structure & Sections
The navigation will consist of the following five key entry points, linking directly to the full-page components:

1. **HOME**
   - *Target:* Returns to the "Sunset Ritual" Hero Video landing.
   - *Visual:* Minimalist text positioned to not interfere with the Fofoti tree silhouette.

2. **CULINARY & MIXOLOGY (Menu)**
   - *Target:* Navigates to the "Liquid Gold" and "Culinary Art" sections.
   - *Sub-content focus:* Highlights Signature Cocktails (e.g., Eagle Beach Sunset), the Sushi Experience, and Plant-Based options.

3. **EXPERIENCES (Events)**
   - *Target:* Jumps to the "Social Vibe" and "Live Music" sections.
   - *Context:* Includes the Manager’s Cocktail Party and weekly themed nights.

4. **RESERVE WITH US**
   - *Target:* Direct link to the **OpenTable** integration or the dedicated booking layout.
   - *Call to Action:* Styled as the most prominent link, utilizing the "Signature Yellow" (#FFD700) for a subtle but distinct highlight.

5. **CONTACT**
   - *Target:* Navigates to the final footer and "Direct Channels" section.
   - *Details:* Displays location at Amsterdam Manor, WhatsApp link, and social media triggers.

### Interactive States
- **Hover Effect:** Subtle "fade" or letter-spacing expansion (0.1em) to indicate selection without using intrusive boxes or backgrounds.
- **Mobile Navigation:** A full-screen "Curtain Menu" that preserves the same high-resolution sunset background used in the active section.

#### Section Structure (home or landing page, Scroll Order)
1. **Landing Hero:** Full-screen 4K video of the Aruba sunset and Fofoti trees. With no initial menu. 
2. **The Ritual (Who We Are):** Immersive image with large typography telling the brand story.
3. **The Experience (Services):** Direct highlights of the lounge atmosphere.
4. **Culinary Art (Specialty Offerings):** Focus on Sushi and Plant-Based options with high-res food photography.
5. **Liquid Gold (Mixology):** Signature cocktails (Eagle Beach Sunset, Hibiscus Margarita) with smooth hover effects.
6. **Social Vibe (Live Music):** Capturing the social atmosphere and weekly events.
7. **Connect (Direct/Indirect Channels):** High-end layout for booking and social links.
8. **Footer:** Elegant, minimal wrap-up with legal info and Amsterdam Manor synergy.



#### Interactive Features
- **Logo Loader:** A sophisticated entry animation using the brand logo.
- **Parallax Layers:** Subtle depth movement on background images to create a "layered" feel during the snap transitions.
- **SEO Basics:** Semantic HTML (H1-H3), OpenGraph tags for social sharing, and fast LCP (Largest Contentful Paint) optimization.