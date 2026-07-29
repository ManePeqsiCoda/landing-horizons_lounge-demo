## Interactive Menu & Expansion Carousel

### 1. Phase One: The Category Discovery (Grid View)
- **Layout:** Upon selecting a menu category (Drinks, Appetizers, Dishes, Happy Hour, Mixology), the viewport transitions to a **2x2 Full-Screen Grid**.
- **Visuals:** Four high-resolution, pre-loaded images that occupy 100% of the screen (each quadrant is 50vw x 50vh).
- **Typography:** A centralized, high-contrast title in a sophisticated Serif font (e.g., "MIXOLOGY") overlaid across the grid to define the sub-category.
- **Interaction:** Hovering over a quadrant should trigger a subtle zoom-in effect on the image to maintain the "luxury photography" focus.

### 2. Phase Two: The Discrete Transition
- **Trigger:** Clicking any quadrant initiates a **Discrete Scroll Down**.
- **Mechanics:** The page snaps exactly 100vh down to the specific product carousel. This transition must be locked until the animation completes, ensuring the user is fully immersed in the new section without accidental scrolling.

### 3. Phase Three: The Elite Expanding Carousel
- **Component Inspiration:** Based on the "expand-cards" and "Expanding Cards" UI patterns [1].
- **Dimensions:** The carousel occupies **100% of the viewport (100vh x 100vw)**.
- **Vertical Typography:** The name of each item (e.g., "HIBISCUS MARGARITA") must be positioned **vertically** (90-degree rotation) on the side or center of the card to create a modern, editorial vibe.
- **Expansion Logic:** 
    - By default, all cards in the carousel are visible in a narrowed state.
    - **Hover/Active State:** When hovered, the selected card expands smoothly to occupy the majority of the screen, revealing the full detail of the photography [1]. 
    - The other cards contract but remain visible as high-contrast "slivers" on the edges.
- **Contrast:** Ensure the vertical text uses the "Signature Yellow" (#FFD700) or high-contrast white to remain legible over the expanding images.

### 4. Technical Constraints for Development
- **Performance:** Since images are 100% viewport, use Astro’s image optimization or pre-loading for the carousel to avoid "pop-in" during the expansion.
- **State Management:** The carousel must handle the "active" card state via TypeScript to ensure smooth Framer Motion or GSAP transitions that mirror the "21st.dev" reference behavior [1].