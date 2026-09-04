---
version: alpha
name: Kayzen Web
description: >-
  Premium web agency in Lyon specializing in high-conversion site design, SEO, and AI automation for SMEs across
  Auvergne-Rhône-Alpes.
logo:
  src: https://kayzen-lyon.com/apple-touch-icon.png
colors:
  surface: '#ffffff'
  surface-dim: '#f5f5f5'
  surface-bright: '#ffffff'
  surface-container-lowest: '#fafafa'
  surface-container-low: '#f0f0f0'
  surface-container: '#eeeeee'
  surface-container-high: '#e9ecef'
  surface-container-highest: '#e0e0e0'
  on-surface: '#1f2937'
  on-surface-variant: '#6c757d'
  inverse-surface: '#1a1a1a'
  inverse-on-surface: '#f5f5f5'
  outline: '#9ca3af'
  outline-variant: '#d0d0d0'
  surface-tint: '#b74831'
  primary: '#b74831'
  on-primary: '#ffffff'
  primary-container: '#e8d5cf'
  on-primary-container: '#5a2817'
  inverse-primary: '#ffb399'
  secondary: '#1f3b61'
  on-secondary: '#ffffff'
  secondary-container: '#c5d9f1'
  on-secondary-container: '#0f1f35'
  tertiary: '#34d399'
  on-tertiary: '#0a3d2a'
  tertiary-container: '#a6f3d5'
  on-tertiary-container: '#00291f'
  error: '#dc2626'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#7f1d1d'
  primary-fixed: '#e8d5cf'
  primary-fixed-dim: '#d4b8ad'
  on-primary-fixed: '#3d1f0f'
  on-primary-fixed-variant: '#8b3d24'
  secondary-fixed: '#c5d9f1'
  secondary-fixed-dim: '#a9c1dd'
  on-secondary-fixed: '#0f1f35'
  on-secondary-fixed-variant: '#1f3b61'
  tertiary-fixed: '#a6f3d5'
  tertiary-fixed-dim: '#7ae5c3'
  on-tertiary-fixed: '#00291f'
  on-tertiary-fixed-variant: '#1a6b52'
  background: '#ffffff'
  on-background: '#1f2937'
  surface-variant: '#e5e7eb'
typography:
  display:
    fontFamily: Outfit
    fontSize: 63.84px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: '-0.04em'
  headline-lg:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: '-0.02em'
  headline-md:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: '-0.01em'
  title-lg:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  container-max: 1400px
elevation:
  sm: 0 1px 2px rgba(0, 0, 0, 0.06)
  md: 0 4px 12px rgba(0, 0, 0, 0.1)
  lg: 0 16px 40px rgba(0, 0, 0, 0.12)
layout:
  containerMaxWidth: 1400px
  gridColumns: 12
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label-md}'
    rounded: '{rounded.full}'
    padding: 12px 32px
    height: 48px
    boxShadow: '{elevation.md}'
  button-primary-hover:
    backgroundColor: '#a03d28'
    textColor: '{colors.on-primary}'
    transition: background-color 200ms ease
  button-secondary:
    backgroundColor: transparent
    textColor: '{colors.primary}'
    typography: '{typography.label-md}'
    rounded: '{rounded.full}'
    padding: 12px 24px
    height: 48px
    border: 2px solid {colors.primary}
  button-secondary-hover:
    backgroundColor: '{colors.surface-container-high}'
    textColor: '{colors.primary}'
    transition: background-color 200ms ease
  button-ghost:
    backgroundColor: transparent
    textColor: '{colors.on-surface}'
    typography: '{typography.label-md}'
    rounded: '{rounded.full}'
    padding: 12px 24px
    height: 48px
  button-ghost-hover:
    backgroundColor: '{colors.surface-container}'
    transition: background-color 200ms ease
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md}'
    boxShadow: '{elevation.md}'
    border: 1px solid {colors.outline-variant}
  card-hover:
    backgroundColor: '{colors.surface-container-low}'
    boxShadow: '{elevation.lg}'
    transition: box-shadow 200ms ease, background-color 200ms ease
  input-field:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface}'
    typography: '{typography.body-md}'
    rounded: '{rounded.DEFAULT}'
    padding: '{spacing.sm}'
    border: 1px solid {colors.outline-variant}
    height: 40px
  input-field-focus:
    borderColor: '{colors.primary}'
    boxShadow: 0 0 0 3px rgba(183, 72, 31, 0.1)
    transition: border-color 200ms ease, box-shadow 200ms ease
  badge:
    backgroundColor: '{colors.tertiary-container}'
    textColor: '{colors.on-tertiary-container}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: 6px 12px
    display: inline-block
  badge-primary:
    backgroundColor: '{colors.primary-container}'
    textColor: '{colors.on-primary-container}'
  list-item:
    backgroundColor: transparent
    textColor: '{colors.on-surface}'
    rounded: '{rounded.md}'
    padding: '{spacing.sm}'
    transition: background-color 200ms ease
  list-item-hover:
    backgroundColor: '{colors.surface-container-high}'
    textColor: '{colors.primary}'
  header:
    backgroundColor: rgba(255, 255, 255, 0.95)
    textColor: '{colors.on-surface}'
    padding: 16px {spacing.gutter}
    boxShadow: 0 1px 3px rgba(0, 0, 0, 0.08)
    backdropFilter: blur(10px)
  banner:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.on-secondary}'
    padding: '{spacing.md}'
    typography: '{typography.body-md}'
    textAlign: center
---

## Overview

Kayzen Web is a premium web agency based in Lyon, France, serving SMEs across Auvergne-Rhône-Alpes with high-conversion site design, SEO optimization, and AI-powered automation solutions. The brand embodies a "Technical Warmth" aesthetic—combining the precision of modern web engineering with the approachability of human-centered design. The visual language prioritizes clarity and conversion: a warm terracotta primary accent (#b74831) signals action and trust, while a deep navy secondary (#1f3b61) anchors professionalism. The UI evokes a sense of calm efficiency, transforming complex digital strategy into intuitive, measurable outcomes.

Kayzen Web's voice is direct, confident, and results-oriented without being aggressive. The tone avoids jargon-heavy marketing speak in favor of concrete deliverables and timelines. Vocabulary patterns emphasize speed ("2 to 10 weeks"), automation ("processes that run themselves"), and measurable impact ("sites that bring clients"). The brand personality is that of a trusted technical partner—someone who listens, delivers, and celebrates wins with clients. Example sentence in brand voice: "Your site converts visitors into customers. Your team focuses on what matters. We handle the rest."

## Colors

The Kayzen Web color system is rooted in a warm, professional palette designed to build trust while maintaining visual energy. Primary (#b74831, a warm terracotta) is deployed on all call-to-action buttons, interactive elements, and key links—it signals conversion intent and brand identity. Secondary (#1f3b61, deep navy) anchors headlines, navigation, and structural elements, conveying stability and expertise. Tertiary (#34d399, vibrant emerald) is reserved for success states, positive feedback, and accent highlights in data visualizations or status indicators.

The surface stack uses a clean white base (#ffffff) for maximum readability and trust, with carefully calibrated grays for hierarchy: surface-container-high (#e9ecef) for hover states and secondary surfaces, surface-container (#eee

## Typography

The type system pairs Outfit (a geometric, confident sans-serif) for headlines and calls-to-action with Plus Jakarta Sans (a warm, humanistic sans-serif) for body text and UI labels. This pairing communicates both technical precision and approachability. Display-level type (63.84px, 800 weight, -0.04em letter-spacing) is reserved for hero headlines and major section breaks, commanding attention without aggression. Headline-lg (40px, 700 weight) anchors section introductions; headline-md (28px, 700 weight) breaks up content rhythm. Body text runs at 16px with 24px line-height for comfortable reading; body-lg (18px) is used for introductory copy and callouts. Labels on buttons and interactive elements use Outfit at 16px, 700 weight, with 0.01em letter-spacing for crisp, scannable text. On sm

## Layout

Kayzen Web uses a 12-column fluid grid with a fixed max-width of 1400px, centered on the viewport. The page rhythm is built on a 24px gutter (md spacing) for section separation and 40px (lg spacing) for major content blocks. The hero section spans full-width with a 64px (xl spacing) top margin, establishing visual breathing room. Content containers use 24px internal padding; cards and modular components nest within this grid with consistent 12px (sm spacing) gaps between elements. The layout philosophy prioritizes white space as a design tool—negative space around primary CTAs (buttons use 12px vertical, 32px horizontal padding) makes them unmissable without visual noise. Mobile breakpoints compress spacing to sm (12px) gutters and reduce container max-width to 100% minus 24px margins. The

## Elevation & Depth

Depth in Kayzen Web is achieved through a restrained shadow system that avoids heavy drop-shadows in favor of subtle, directional lighting. The elevation scale uses three levels: sm (0 1px 2px rgba(0,0,0,0.06)) for minor UI elements like badges and small cards; md (0 4px 12px rgba(0,0,0,0.1)) for primary cards, buttons, and modals; lg (0 16px 40px rgba(0,0,0,0.12)) for elevated overlays and hero imagery. Interactive elements use focus rings instead of shadow changes: a 3px solid border of rgba(183, 72, 31, 0.1) around inputs and buttons on focus. The header uses a minimal 0 1px 3px rgba(0,0,0,

## Shapes

The shape language follows a "Soft-Technical" philosophy: rounded corners are used strategically to soften the geometric precision of the grid while maintaining modern, professional aesthetics. Buttons and primary CTAs use full border-radius (9999px) to create pill-shaped forms that feel friendly and inviting—this is the most distinctive shape in the system, appearing on all primary actions. Cards and containers use lg (1rem / 16px) border-radius for a balanced, approachable feel. Input fields and secondary surfaces use DEFAULT (0.5rem / 8px) for a more structured, technical appearance. Badges

## Components

### Action Elements
Buttons are the primary interaction pattern. Primary buttons (button-primary) use {colors.primary} (#b74831) background, {colors.on-primary} (white) text, Outfit 16px 700 weight, 9999px border-radius, and 12px vertical × 32px horizontal padding for a 48px total height. On hover (button-primary-hover), the background darkens to #a03d28 with a 200ms ease transition. Secondary buttons (button-secondary) invert this: transparent background, {colors.primary} text, 2px solid {colors.primary} border, same padding and radius. Ghost buttons (button-ghost) use transparent background with {colors.on-surface} text and no border, appearing only on hover with {colors.surface-container} background. All buttons apply box-shadow: 0 4px 12px rgba(0,0,0,0.1) for subtle depth.

### Contain

## Do's and Don'ts

**Do**
- Do use the primary terracotta (#b74831) exclusively on CTAs, focus states, and brand-critical interactions—never on passive elements or backgrounds.
- Do apply 24px (md) spacing between major sections and 12px (sm) spacing between nested components to maintain visual rhythm and scanability.
- Do pair Outfit headlines with Plus Jakarta Sans body text to signal confidence in headlines and warmth in supporting copy.
- Do use the full 9999px border-radius on all primary buttons and badges to create a distinctive, friendly interaction pattern.
- Do transition interactive states over 200ms with ease timing (e.g., hover, focus) to signal responsiveness without jarring motion.
- Do apply box-shadow: 0 4px 12px rgba(0,0,0,0.1) to cards and elevated surfaces for subtle, directional depth.

**Don't**
- Don't use the primary color on non-interactive elements, backgrounds, or decorative shapes—reserve it for actions and focus states only.
- Don't exceed lg spacing (40px) between sections unless creating intentional visual separation for distinct page regions.
- Don't mix Outfit and Plus Jakarta Sans weights arbitrarily; use Outfit 700+ for headlines and Outfit 700 for labels, Plus Jakarta Sans 400 for body.
- Don't apply border-radius smaller than DEFAULT (0.5rem / 8px) to buttons or primary interactive elements—it reduces their visual prominence.
- Don't use heavy shadows (lg elevation) on small components like badges or input fields; reserve lg shadows for modals and hero imagery.
- Don't apply color changes on hover without a transition property; always use transition: background-color 200ms ease or equivalent for smooth state changes.
