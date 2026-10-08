import { useEffect, useRef, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Heart, House, Search } from "lucide-preact";
import clsx from "clsx";
import styles from "./BottomNav.module.css";

interface Tab {
  href: string;
  label: string;
  Icon: typeof House;
  isActive: (path: string) => boolean;
}

const TABS: Tab[] = [
  { href: "/", label: "Inicio", Icon: House, isActive: (path) => path === "/" || path === "/home" },
  { href: "/search", label: "Búsqueda", Icon: Search, isActive: (path) => path === "/search" },
  {
    href: "/favorites",
    label: "Favoritos",
    Icon: Heart,
    isActive: (path) => path === "/favorites",
  },
];

const HIDE_AFTER_SCROLL_PX = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

class Spring {
  value: number;
  target: number;
  velocity = 0;

  constructor(
    value: number,
    private readonly stiffness: number,
    private readonly dampingRatio: number,
  ) {
    this.value = value;
    this.target = value;
  }

  setTarget(target: number) {
    this.target = target;
  }

  step(dt: number) {
    const damping = 2 * this.dampingRatio * Math.sqrt(this.stiffness);
    const acceleration = -this.stiffness * (this.value - this.target) - damping * this.velocity;
    this.velocity += acceleration * dt;
    this.value += this.velocity * dt;
  }

  get isResting() {
    return Math.abs(this.value - this.target) < 0.05 && Math.abs(this.velocity) < 0.5;
  }
}

interface Engine {
  position: Spring;
  velocity: Spring;
  scaleX: Spring;
  scaleY: Spring;
  press: Spring;
}

// Reference tab-indicator springs (stiffness, dampingRatio) from the motion spec.
function createEngine(): Engine {
  return {
    position: new Spring(0, 1000, 1),
    velocity: new Spring(0, 300, 0.5),
    scaleX: new Spring(1, 250, 0.6),
    scaleY: new Spring(1, 250, 0.7),
    press: new Spring(1, 1000, 1),
  };
}

function stepEngine(engine: Engine, dt: number) {
  engine.velocity.setTarget(clamp(engine.position.velocity / 800, -1, 1));
  engine.velocity.step(dt);

  const stretch = Math.abs(engine.velocity.value);
  engine.scaleX.setTarget(1 + stretch * 0.18);
  engine.scaleY.setTarget(1 - stretch * 0.12);

  engine.scaleX.step(dt);
  engine.scaleY.step(dt);
  engine.press.step(dt);
  engine.position.step(dt);
}

function applyTransform(element: HTMLElement, engine: Engine) {
  const scaleX = engine.scaleX.value * engine.press.value;
  const scaleY = engine.scaleY.value * engine.press.value;
  element.style.transform = `translate3d(${engine.position.value}px, 0, 0) scale(${scaleX}, ${scaleY})`;
}

function engineResting(engine: Engine) {
  return (
    engine.position.isResting &&
    engine.velocity.isResting &&
    engine.scaleX.isResting &&
    engine.scaleY.isResting &&
    engine.press.isResting
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BottomNav() {
  const { path } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<Engine>(createEngine());
  const remeasureRef = useRef<() => void>(() => {});
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const engine = engineRef.current;
    const nav = navRef.current;
    if (!nav) return;

    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      stepEngine(engine, dt);
      const indicator = indicatorRef.current;
      if (indicator) applyTransform(indicator, engine);
      if (engineResting(engine)) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const remeasure = () => {
      const indicator = indicatorRef.current;
      if (!indicator) return;
      const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a[data-tab]"));
      const index = TABS.findIndex((tab) => tab.isActive(window.location.pathname));
      if (index < 0) {
        indicator.style.opacity = "0";
        return;
      }
      const link = links[index];
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.opacity = "1";
      const target = link.offsetLeft;

      if (prefersReducedMotion()) {
        engine.position.value = target;
        engine.position.target = target;
        engine.position.velocity = 0;
        applyTransform(indicator, engine);
        return;
      }

      engine.position.setTarget(target);
      wake();
    };

    remeasureRef.current = remeasure;
    remeasure();

    const press = () => {
      engine.press.setTarget(0.92);
      wake();
    };
    const release = () => {
      engine.press.setTarget(1);
      wake();
    };
    nav.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);

    const onResize = () => remeasure();
    window.addEventListener("resize", onResize);

    // Window scroll only: a horizontal rail scroll never bubbles here, so the bar stays put.
    let lastY = window.scrollY;
    let hiddenNow = false;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        const next =
          y <= 4
            ? false
            : delta > HIDE_AFTER_SCROLL_PX
              ? true
              : delta < -HIDE_AFTER_SCROLL_PX
                ? false
                : hiddenNow;
        if (next !== hiddenNow) {
          hiddenNow = next;
          setHidden(next);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      nav.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    remeasureRef.current();
  }, [path]);

  return (
    <nav
      ref={navRef}
      class={clsx(styles.nav, hidden && styles.hidden)}
      aria-label="Navegación principal"
    >
      <span ref={indicatorRef} class={styles.indicator} aria-hidden="true" />
      {TABS.map(({ href, label, Icon, isActive }) => {
        const active = isActive(path);
        return (
          <a
            key={href}
            href={href}
            data-tab
            class={clsx(styles.link, active && styles.active)}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
            <span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
