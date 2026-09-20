"use client";

import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface TabItem {
  icon: React.ReactNode;
  color: string;
  label?: string;
}

export interface AnimatedTabBarProps {
  items: TabItem[];
  defaultIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  defaultIndex = 0,
  activeIndex: controlledIndex,
  onTabChange,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const activeIndex = controlledIndex ?? selectedIndex;
  const menuRef = useRef<HTMLElement>(null);
  const menuBorderRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const offsetMenuBorder = useCallback(() => {
    const activeItem = itemRefs.current[activeIndex];
    const menu = menuRef.current;
    const menuBorder = menuBorderRef.current;

    if (!activeItem || !menu || !menuBorder) return;

    const itemRect = activeItem.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const left = itemRect.left - menuRect.left + (itemRect.width - menuBorder.offsetWidth) / 2;
    menuBorder.style.transform = `translate3d(${Math.floor(left)}px, 0, 0)`;
  }, [activeIndex]);

  useLayoutEffect(() => {
    offsetMenuBorder();
    const handleResize = () => offsetMenuBorder();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [offsetMenuBorder]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (activeIndex + direction + items.length) % items.length;
      handleItemClick(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    };

    menuRef.current?.addEventListener("keydown", handleKeyDown);
    return () => menuRef.current?.removeEventListener("keydown", handleKeyDown);
  });

  const handleItemClick = (index: number) => {
    if (controlledIndex === undefined) setSelectedIndex(index);
    if (index !== activeIndex) onTabChange?.(index);
  };

  return (
    <nav ref={menuRef} className="animated-tab-bar" aria-label="Primary navigation">
      {items.map((item, index) => (
        <button
          key={item.label ?? index}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          type="button"
          className={`animated-tab-bar__item ${activeIndex === index ? "is-active" : ""}`}
          style={{ "--tab-color": item.color } as React.CSSProperties}
          onClick={() => handleItemClick(index)}
          aria-label={item.label ?? `Tab ${index + 1}`}
          aria-current={activeIndex === index ? "page" : undefined}
        >
          {item.icon}
          {item.label && <span className="animated-tab-bar__label">{item.label}</span>}
        </button>
      ))}
      <div ref={menuBorderRef} className="animated-tab-bar__border" aria-hidden="true" />
    </nav>
  );
};
