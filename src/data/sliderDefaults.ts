import { AllSlidersData } from '../types';
import { safeStorage } from '../utils/safeStorage';

export const DEFAULT_SLIDERS_DATA: AllSlidersData = {
  // §01 · MASTER HERO · 21:9
  s1: [
    {
      id: 's1-1',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx_wallpaper_4.jpg?v=1779844302',
      tag: 'Master OS',
      title: 'Cinematic Grading Redefined',
      sub: 'System Architecture v3.0 · 8K Pipeline',
    },
    {
      id: 's1-2',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-16-40-096.jpg?v=1779844301',
      tag: 'Industrial Realism',
      title: 'RAWx Drop 01',
      sub: 'Film Emulation Engine · Grain Synthesis',
    },
    {
      id: 's1-3',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_01-54-03-799.jpg?v=1779844300',
      tag: 'Brutalist',
      title: 'System Architecture',
      sub: 'RAW Processing · Hasselblad Quality',
    },
    {
      id: 's1-4',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-14-45-314.jpg?v=1779844300',
      tag: 'Visuals',
      title: 'Hasselblad Quality',
      sub: 'Medium Format Profiles · Detail Preservation',
    },
    {
      id: 's1-5',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_01-59-49-961.jpg?v=1779844300',
      tag: 'Workflow',
      title: 'AI Automation Engine',
      sub: 'Batch Processing · One-Click Pipeline',
    },
    {
      id: 's1-6',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-25_06-21-00-005.jpg?v=1779844299',
      tag: 'Techno',
      title: 'Raw Aesthetic',
      sub: 'Industrial Color Science · Tonal Mapping',
    },
    {
      id: 's1-7',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_01-50-20-630.jpg?v=1779844299',
      tag: 'Color',
      title: '8K Resolution Textures',
      sub: 'Ultra High Definition · Texture Packs',
    },
    {
      id: 's1-8',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Picsart_26-05-24_02-11-50-131.jpg?v=1779844299',
      tag: 'Final',
      title: 'The Complete Pipeline',
      sub: 'End-to-End · Master Distribution Pack',
    },
  ],

  // §02 · SQUARE MATRIX 4-COL
  s2a: [
    { id: 's2a-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_9.jpg?v=1779849777', tag: 'Core 01', title: 'Module Alpha', sub: 'Core Processing' },
    { id: 's2a-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_8.jpg?v=1779849777', tag: 'Core 02', title: 'Shadow Detail', sub: 'Dynamic Range' },
    { id: 's2a-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_7.jpg?v=1779849777', tag: 'Core 03', title: 'Grain Engine', sub: 'Film Emulation' },
  ],
  s2b: [
    { id: 's2b-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_3.png?v=1779849789', tag: 'FX 01', title: 'Halation Glow', sub: 'Optical FX' },
    { id: 's2b-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_2.png?v=1779849788', tag: 'FX 02', title: 'Bloom Flare', sub: 'Highlight Spread' },
    { id: 's2b-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_1.png?v=1779849788', tag: 'FX 03', title: 'Gate Weave', sub: 'Analog Motion' },
  ],
  s2c: [
    { id: 's2c-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788', tag: 'Tone 01', title: 'Teal & Steel', sub: 'Cool Latitude' },
    { id: 's2c-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_2.jpg?v=1779849775', tag: 'Tone 02', title: 'Amber Pulse', sub: 'Warm Golden' },
    { id: 's2c-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_1.jpg?v=1779849776', tag: 'Tone 03', title: 'Deep Noir', sub: 'High Contrast' },
  ],
  s2d: [
    { id: 's2d-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-180_-01_1.jpg?v=1779849775', tag: 'Drop 01', title: 'Urban Grit', sub: 'Street Tone' },
    { id: 's2d-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-180_-01_3.jpg?v=1779849776', tag: 'Drop 02', title: 'Neon Rain', sub: 'Cyber Shimmer' },
    { id: 's2d-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-180_-01_4.jpg?v=1779849777', tag: 'Drop 03', title: 'Studio Flash', sub: 'Clean Strobe' },
  ],

  // §03 · ULTRA WIDE 32:9
  s3: [
    { id: 's3-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_2.jpg?v=1779859517', tag: 'Landscape', title: 'Vast Horizons', sub: '32:9 Panorama View' },
    { id: 's3-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/22394-01.jpg?v=1776824437', tag: 'Panorama', title: 'City Scape', sub: 'Metropolitan Horizon' },
    { id: 's3-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778997941425.png?v=1779850501', tag: 'Details', title: 'Macro Textures', sub: '8K Surface Fidelity' },
    { id: 's3-4', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778992797795.png?v=1779850501', tag: 'Motion', title: 'High Speed Capture', sub: '120fps Realtime' },
    { id: 's3-5', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778968066326.png?v=1779850501', tag: 'Studio', title: 'Controlled Light', sub: 'Sculpted Shadows' },
    { id: 's3-6', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778970018526.png?v=1779850501', tag: 'Location', title: 'Natural Bleach', sub: 'Sunlight Extraction' },
  ],

  // §04 · ASYMMETRIC SPLIT
  s4a: [
    { id: 's4a-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_1.jpg?v=1779859520', tag: 'Vol 1', title: 'Look A', sub: 'Teal · Muted · Filmic' },
    { id: 's4a-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511', tag: 'Vol 1', title: 'Look B', sub: 'Warm · Amber · Vintage' },
    { id: 's4a-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_2.jpg?v=1779859511', tag: 'Vol 1', title: 'Look C', sub: 'Noir · Contrasty · Gritty' },
    { id: 's4a-4', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_1.jpg?v=1779859509', tag: 'Vol 1', title: 'Look D', sub: 'Clean · Editorial · Modern' },
    { id: 's4a-5', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_2.jpg?v=1779859509', tag: 'Vol 1', title: 'Look E', sub: 'Cross-Process · Vivid' },
    { id: 's4a-6', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_3.jpg?v=1779859509', tag: 'Vol 1', title: 'Look F', sub: 'Bleach Bypass · Silver' },
  ],
  s4b: [
    { id: 's4b-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_4.png?v=1779849787', tag: 'Vol 2', title: 'Style X', sub: 'Brutalist Contrast' },
    { id: 's4b-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_3.png?v=1779849788', tag: 'Vol 2', title: 'Style Y', sub: 'Ethereal Grain' },
    { id: 's4b-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_3.png?v=1779849788', tag: 'Vol 2', title: 'Style Z', sub: 'High Definition' },
  ],

  // §05 · PORTRAIT TRIPTYCH
  s5a: [
    { id: 's5a-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina-18-01_1.jpg?v=1779859512', tag: 'Grade 1', title: 'Filmic Pull', sub: 'Soft Highlights' },
    { id: 's5a-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina-18-01_2.jpg?v=1779859512', tag: 'Grade 2', title: 'Dark Push', sub: 'Shadow Crunch' },
    { id: 's5a-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina-18-01_3.jpg?v=1779859510', tag: 'Grade 3', title: 'Bleach Pass', sub: 'Silver Retain' },
  ],
  s5b: [
    { id: 's5b-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-05_1.jpg?v=1779859508', tag: 'Look 1', title: 'Amber Core', sub: 'Golden Sunset' },
    { id: 's5b-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-05_2.jpg?v=1779859506', tag: 'Look 2', title: 'Steel Blue', sub: 'Cyan Atmosphere' },
    { id: 's5b-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-05_3.jpg?v=1779859507', tag: 'Look 3', title: 'Red Desat', sub: 'Cinematic Muted' },
  ],
  s5c: [
    { id: 's5c-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-07_1.jpg?v=1779859507', tag: 'FX 1', title: 'Halation Glow', sub: 'Edge Diffusion' },
    { id: 's5c-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-07_2.jpg?v=1779859508', tag: 'FX 2', title: 'Gate Weave', sub: 'Mechanical Jitter' },
    { id: 's5c-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-07_3.jpg?v=1779859508', tag: 'FX 3', title: 'Vignette Crush', sub: 'Corner Density' },
  ],

  // §06 · CROSSFADE HERO
  s6: [
    { id: 's6-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_1.jpg?v=1779859505', tag: 'Stream 01', title: 'Live Preview', sub: 'Broadcast Engine' },
    { id: 's6-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_2.jpg?v=1779859508', tag: 'Stream 02', title: 'Continuous Feed', sub: 'Frame-by-Frame' },
    { id: 's6-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_1.jpg?v=1779859505', tag: 'Stream 03', title: 'Distribution Engine', sub: 'Ultra Scaled Output' },
    { id: 's6-4', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_3.jpg?v=1779859509', tag: 'Stream 04', title: 'Seamless Loop', sub: 'Infinite Playback' },
  ],

  // §07 · PORTRAIT GRID 4:5
  s7a: [
    { id: 's7a-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-18-02_1.jpg?v=1779858376', tag: 'Look 01', title: 'Editorial Noir' },
    { id: 's7a-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_1.jpg?v=1779859506', tag: 'Look 02', title: 'High Fashion' },
  ],
  s7b: [
    { id: 's7b-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-18-02_2.jpg?v=1779859509', tag: 'Look 03', title: 'Studio Monolith' },
    { id: 's7b-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_2.jpg?v=1779859505', tag: 'Look 04', title: 'Warm Tone' },
  ],
  s7c: [
    { id: 's7c-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-18-02_3.jpg?v=1779859505', tag: 'Look 05', title: 'Shadow Retain' },
    { id: 's7c-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_3.jpg?v=1779859507', tag: 'Look 06', title: 'Silver Sheen' },
  ],
  s7d: [
    { id: 's7d-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-18-02_4.jpg?v=1779859503', tag: 'Look 07', title: 'Grain Matrix' },
    { id: 's7d-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_9.jpg?v=1779849777', tag: 'Look 08', title: 'Organic Texture' },
  ],

  // §08 · DUAL LANDSCAPE 16:9
  s8a: [
    { id: 's8a-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_2.jpg?v=1779859511', tag: 'Left A', title: 'Channel One', sub: 'Analog Feed' },
    { id: 's8a-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_1.jpg?v=1779859521', tag: 'Left B', title: 'Channel Two', sub: 'Digital Uplink' },
  ],
  s8b: [
    { id: 's8b-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kiara-Alia-01_1.jpg?v=1779859503', tag: 'Right A', title: 'System A', sub: 'Synchronized Deck' },
    { id: 's8b-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kiara-Alia-01_14.png?v=1779859538', tag: 'Right B', title: 'System B', sub: 'Secondary Matrix' },
  ],

  // §09 · STANDARD HERO 16:9
  s9: [
    { id: 's9-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_1.jpg?v=1779859506', tag: 'Traditional', title: 'Controlled Format', sub: '16:9 Clean Frame' },
    { id: 's9-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_2.jpg?v=1779859505', tag: 'Editorial', title: 'Clean Presentation', sub: 'High Fidelity Plate' },
    { id: 's9-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_3.jpg?v=1779859507', tag: 'Impact', title: 'Bold Typography', sub: 'Serif Italian Pairing' },
  ],

  // §10 · FOOTER BANNER 8:1
  s10: [
    { id: 's10-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_3.jpg?v=1779859507', tag: 'Banner 1', title: 'Ultra Wide Slice' },
    { id: 's10-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_1.jpg?v=1779859506', tag: 'Banner 2', title: 'Panoramic Strip' },
  ],

  // §11 · BEFORE / AFTER
  s11: {
    beforeUrl: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778967907457.png?v=1779850502',
    afterUrl: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778967907457.png?v=1779850502',
    beforeLabel: 'RAW',
    afterLabel: 'GRADED',
    title: 'Drag to Reveal LUT Transformation',
    tag: 'Grade Comparison',
    sub: 'Teal & Steel · RAWx Master Grade',
    filterMode: 'saturate(.75) hue-rotate(10deg) contrast(1.15) brightness(.92)',
  },

  // §12 · VIDEO SLIDE 21:9
  s12: [
    {
      id: 's12-1',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778967907457.png?v=1779850502',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      tag: 'Video · 01',
      title: 'Live Preview Feed',
      sub: 'Muted Autoplay · Seamless Loop',
    },
    {
      id: 's12-2',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_4.png?v=1779849787',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      tag: 'Video · 02',
      title: 'Broadcast Engine',
      sub: 'Continuous Distribution Pipeline',
    },
    {
      id: 's12-3',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/1778967907457.png?v=1779850502',
      tag: 'Video · 03',
      title: 'Still Frame Mode',
      sub: 'High-Res Fallback Image Slide',
    },
  ],

  // §A · ZOOM-BURST 21:9
  sA: [
    {
      id: 'sA-1',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_4.png?v=1779849787',
      tag: 'RAWx Drop 01',
      title: 'The Unfiltered Truth',
      sub: 'Brutalist · Raw · Permanent',
    },
    {
      id: 'sA-2',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788',
      tag: 'Kareena Series',
      title: 'Sovereign Presence',
      sub: 'Medium Format · Teal Grade',
    },
    {
      id: 'sA-3',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_3.png?v=1779849789',
      tag: 'Mehzabina 01',
      title: 'Tension Without Resolution',
      sub: 'Film Emulation · Grain · Halation',
    },
    {
      id: 'sA-4',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511',
      tag: 'Hypnotic Series',
      title: 'Industrial Realism',
      sub: 'Pendulum · Amber Pulse',
    },
    {
      id: 'sA-5',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_3.jpg?v=1779859509',
      tag: 'Laxmi Series',
      title: 'Controlled Exposure',
      sub: 'Bleach Bypass · Silver Tone',
    },
    {
      id: 'sA-6',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_1.jpg?v=1779859520',
      tag: 'Alia 01',
      title: 'Form Meets Force',
      sub: 'Cross-Process · Vivid · Cinematic',
    },
  ],

  // §B · STAGGER REVEAL GRID 3×2
  sB: {
    cells: [
      {
        title: 'Frame 01',
        sets: [
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_9.jpg?v=1779849777',
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena_1.jpg?v=1779859506',
        ],
      },
      {
        title: 'Frame 02',
        sets: [
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_3.png?v=1779849789',
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-05_1.jpg?v=1779859508',
        ],
      },
      {
        title: 'Frame 03',
        sets: [
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788',
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina-18-01_1.jpg?v=1779859512',
        ],
      },
      {
        title: 'Frame 04',
        sets: [
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-180_-01_1.jpg?v=1779849775',
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_2.jpg?v=1779859511',
        ],
      },
      {
        title: 'Frame 05',
        sets: [
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_1.jpg?v=1779859509',
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_2.jpg?v=1779859517',
        ],
      },
      {
        title: 'Frame 06',
        sets: [
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-07_1.jpg?v=1779859507',
          'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kiara-Alia-01_1.jpg?v=1779859503',
        ],
      },
    ],
  },

  // §C · COUNTDOWN RING 16:9
  sC: [
    {
      id: 'sC-1',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_1.jpg?v=1779859505',
      tag: 'Chapter 01',
      title: 'Controlled Chaos',
      sub: 'ISO 800 · f/1.4 · 1/500s',
    },
    {
      id: 'sC-2',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi_-18-04_2.jpg?v=1779859508',
      tag: 'Chapter 02',
      title: 'Sovereign Grain',
      sub: 'Kodak 400 Emulation · Teal Pull',
    },
    {
      id: 'sC-3',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-05_1.jpg?v=1779859508',
      tag: 'Chapter 03',
      title: 'Amber Burn',
      sub: 'Fuji 800Z · Warm Latitude',
    },
    {
      id: 'sC-4',
      url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Laxmi-18-07_1.jpg?v=1779859507',
      tag: 'Chapter 04',
      title: 'Deep Noir Archive',
      sub: 'Ilford HP5 · Push +2 · 35mm',
    },
  ],

  // §D · SPLIT-PANEL DUAL-AXIS
  sD: {
    left: [
      { id: 'sD-l1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_9.jpg?v=1779849777', title: 'Drop 01 · Rani Wet', tag: 'Left Axis' },
      { id: 'sD-l2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_8.jpg?v=1779849777', title: 'Drop 01 · Shadow', tag: 'Left Axis' },
      { id: 'sD-l3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani-wet-tee_7.jpg?v=1779849777', title: 'Drop 01 · Grain', tag: 'Left Axis' },
    ],
    right: [
      { id: 'sD-r1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788', title: 'Kareena · Teal', tag: 'Right Axis' },
      { id: 'sD-r2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_2.jpg?v=1779849775', title: 'Kareena · Amber', tag: 'Right Axis' },
      { id: 'sD-r3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_1.jpg?v=1779849776', title: 'Kareena · Noir', tag: 'Right Axis' },
    ],
  },

  // §E · INERTIA FILMSTRIP
  sE: [
    { id: 'sE-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511', title: 'Pendulum 07', tag: 'Film Frame 01' },
    { id: 'sE-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_2.jpg?v=1779859511', title: 'Pendulum 02', tag: 'Film Frame 02' },
    { id: 'sE-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kiara-Alia-01_1.jpg?v=1779859503', title: 'Kiara-Alia 01', tag: 'Film Frame 03' },
    { id: 'sE-4', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kiara-Alia-01_14.png?v=1779859538', title: 'Kiara-Alia 14', tag: 'Film Frame 04' },
    { id: 'sE-5', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_1.jpg?v=1779859509', title: 'Laxmi 01', tag: 'Film Frame 05' },
    { id: 'sE-6', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_2.jpg?v=1779859509', title: 'Laxmi 02', tag: 'Film Frame 06' },
    { id: 'sE-7', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-LAXMI-_3.jpg?v=1779859509', title: 'Laxmi 03', tag: 'Film Frame 07' },
  ],

  // §F · WIPE-TRANSITION 21:9
  sF: [
    { id: 'sF-1', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Rani_01_4.png?v=1779849787', tag: 'Wipe 01', title: 'Edge Precision', sub: 'Directional Wipe Cut' },
    { id: 'sF-2', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Mehzabina_01_3.png?v=1779849789', tag: 'Wipe 02', title: 'Motion Architecture', sub: 'Vertical Sweep' },
    { id: 'sF-3', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Kareena-18-01_3.png?v=1779849788', tag: 'Wipe 03', title: 'Vertical Force', sub: 'Horizontal Blade Cut' },
    { id: 'sF-4', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/Alia-01_1.jpg?v=1779859520', tag: 'Wipe 04', title: 'Lateral Cut', sub: 'Diagonal Clip Wipe' },
    { id: 'sF-5', url: 'https://cdn.shopify.com/s/files/1/0678/5957/8923/files/RAWx-Hypnotic-Pendulum-18-01_7.jpg?v=1779859511', tag: 'Wipe 05', title: 'Sovereign Reveal', sub: 'Master Optical Sweep' },
  ],
};

const STORAGE_KEY = 'rawx_master_sliders_data_v3';

export function getStoredSlidersData(): AllSlidersData {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SLIDERS_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SLIDERS_DATA, ...parsed };
  } catch (e) {
    console.error('Failed to load sliders data from storage:', e);
    return DEFAULT_SLIDERS_DATA;
  }
}

export function saveSlidersData(data: AllSlidersData): void {
  try {
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save sliders data to storage:', e);
  }
}

export function resetSlidersData(): AllSlidersData {
  try {
    safeStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SLIDERS_DATA;
}

