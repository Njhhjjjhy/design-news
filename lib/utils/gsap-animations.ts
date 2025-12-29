import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Stagger animation for cards
export function animateCardsIn(selector: string | NodeListOf<Element> | Element[], delay = 0) {
  return gsap.from(selector, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: 0.1,
    delay,
    ease: 'power3.out',
  });
}

// Hover animation for cards
export function setupCardHover(element: HTMLElement) {
  const hoverTl = gsap.timeline({ paused: true });
  
  hoverTl.to(element, {
    y: -8,
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
  });

  element.addEventListener('mouseenter', () => hoverTl.play());
  element.addEventListener('mouseleave', () => hoverTl.reverse());
  
  return hoverTl;
}

// Button hover animation
export function setupButtonHover(element: HTMLElement) {
  const hoverTl = gsap.timeline({ paused: true });
  
  hoverTl.to(element, {
    scale: 1.05,
    duration: 0.2,
    ease: 'back.out(1.7)',
  });

  element.addEventListener('mouseenter', () => hoverTl.play());
  element.addEventListener('mouseleave', () => hoverTl.reverse());
  
  return hoverTl;
}

// Badge hover animation
export function setupBadgeHover(element: HTMLElement) {
  const hoverTl = gsap.timeline({ paused: true });
  
  hoverTl.to(element, {
    scale: 1.1,
    y: -2,
    duration: 0.2,
    ease: 'back.out(1.7)',
  });

  element.addEventListener('mouseenter', () => hoverTl.play());
  element.addEventListener('mouseleave', () => hoverTl.reverse());
  
  return hoverTl;
}

// Icon rotation animation
export function animateIcon(element: HTMLElement) {
  return gsap.to(element, {
    rotation: 360,
    duration: 0.6,
    ease: 'power2.out',
  });
}

// Text reveal animation
export function revealText(element: HTMLElement) {
  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
  });
}

// Scroll-triggered fade in
export function scrollFadeIn(selector: string | HTMLElement) {
  const element = typeof selector === 'string' ? selector : selector;
  return gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}

// Stagger text animation
export function staggerText(element: HTMLElement, delay = 0.05) {
  const text = element.textContent || '';
  const chars = text.split('');
  element.innerHTML = '';
  
  chars.forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    element.appendChild(span);
  });

  return gsap.from(element.children, {
    opacity: 0,
    y: 20,
    rotationX: -90,
    duration: 0.5,
    stagger: delay,
    ease: 'back.out(1.7)',
  });
}

// Search input focus animation
export function animateSearchFocus(element: HTMLElement) {
  const focusTl = gsap.timeline({ paused: true });
  
  focusTl.to(element, {
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
  });

  element.addEventListener('focus', () => focusTl.play());
  element.addEventListener('blur', () => focusTl.reverse());
  
  return focusTl;
}

// Page transition animation
export function pageTransitionIn() {
  return gsap.from('main', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
  });
}

