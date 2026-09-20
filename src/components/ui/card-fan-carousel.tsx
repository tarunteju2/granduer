"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

interface SocialCardsProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7,  scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, zIndex: 10 },
  { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, zIndex: 3 },
  { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, zIndex: 2 },
  { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

const ARROW_CLASSES =
  "relative flex items-center justify-center rounded-full border-[1.5px] border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-[16px] text-black/40 dark:text-white/55 cursor-pointer shrink-0 z-30 outline-none shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-black/25 dark:hover:border-white/25 hover:text-black/70 dark:hover:text-white/80 active:opacity-70 transition-colors duration-300 before:content-[''] before:absolute before:inset-[3px] before:rounded-full before:border before:border-black/[0.04] dark:before:border-white/[0.04] before:pointer-events-none";

interface FanCardProps {
  card: CardItem;
  index: number;
  slot: number | undefined;
  isEntering: boolean;
  enterDirection: "left" | "right" | undefined;
  needsPagination: boolean;
  totalCards: number;
}

function FanCard({ card, index, slot, isEntering, enterDirection, needsPagination, totalCards }: FanCardProps) {
  const multiplier = getResponsiveMultiplier(typeof window !== "undefined" ? window.innerWidth : 1024);
  const hMult = getHeightMultiplier(typeof window !== "undefined" ? window.innerWidth : 1024);

  if (!needsPagination) {
    // No pagination - show all cards in fan layout
    const config = getSlotConfig(totalCards, index);
    return (
      <motion.div
        className="fan-card absolute"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: config.x * multiplier,
          y: config.y * hMult,
          rotate: config.rot,
          scale: config.scale,
          zIndex: config.zIndex,
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          y: { type: "spring", stiffness: 300, damping: 30 },
          rotate: { type: "spring", stiffness: 300, damping: 30 },
          scale: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 },
        }}
        style={{ width: 180, height: 240 }}
      >
        <CardImage card={card} index={index} />
      </motion.div>
    );
  }

  if (slot === undefined) {
    return null;
  }

  const config = getSlotConfig(MAX_VISIBLE, slot);

  return (
    <motion.div
      className="fan-card absolute"
      initial={isEntering ? {
        opacity: 0,
        x: enterDirection === "right" ? 200 : -200,
        y: config.y * hMult,
        rotate: enterDirection === "right" ? 30 : -30,
        scale: 0.5,
      } : {
        opacity: 0,
        scale: 0.3,
        x: 0,
        y: 0,
        rotate: 0,
      }}
      animate={{
        opacity: 1,
        x: config.x * multiplier,
        y: config.y * hMult,
        rotate: config.rot,
        scale: config.scale,
        zIndex: config.zIndex,
      }}
      exit={{
        opacity: 0,
        x: enterDirection === "right" ? -200 : 200,
        rotate: enterDirection === "right" ? -30 : 30,
        scale: 0.5,
      }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        y: { type: "spring", stiffness: 300, damping: 30 },
        rotate: { type: "spring", stiffness: 300, damping: 30 },
        scale: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      }}
      style={{ width: 180, height: 240 }}
    >
      <CardImage card={card} index={index} />
    </motion.div>
  );
}

function CardImage({ card, index }: { card: CardItem; index: number }) {
  const content = (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={card.imgUrl}
        loading="lazy"
        alt={card.alt || `Card ${index}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );

  if (card.linkUrl) {
    return (
      <a
        href={card.linkUrl}
        target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="block h-full w-full cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default function SocialCards({ cards }: SocialCardsProps) {
  const [centerIndex, setCenterIndex] = useState(HALF);
  const [enterDirection, setEnterDirection] = useState<"left" | "right" | null>(null);

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;

  const getVisibleIndices = useCallback((center: number): number[] => {
    const indices: number[] = [];
    for (let slot = 0; slot < MAX_VISIBLE; slot++) {
      indices.push(((center + slot - HALF) % totalCards + totalCards) % totalCards);
    }
    return indices;
  }, [totalCards]);

  const cycle = useCallback((direction: "left" | "right") => {
    setEnterDirection(direction);
    setCenterIndex(prev =>
      direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
    );

    // Reset direction after animation
    setTimeout(() => {
      setEnterDirection(null);
    }, 600);
  }, [totalCards]);

  const chevron = (direction: "left" | "right") => (
    <svg className="relative z-[2] w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  const visibleIndices = needsPagination ? getVisibleIndices(centerIndex) : cards.map((_, i) => i);
  const isEntering = enterDirection !== null;

  return (
    <section className="relative z-20 flex w-full flex-col items-center px-4 py-4 lg:py-8 md:px-8">
      <div className="relative flex w-full max-w-[90rem] items-center justify-center">
        <div className="fan-layout relative flex h-[280px] w-full max-w-[80rem] items-center justify-center">
          <AnimatePresence mode="popLayout">
            {needsPagination ? (
              visibleIndices.map((cardIndex, slot) => (
                <FanCard
                  key={cards[cardIndex].imgUrl}
                  card={cards[cardIndex]}
                  index={cardIndex}
                  slot={slot}
                  isEntering={isEntering}
                  enterDirection={enterDirection ?? undefined}
                  needsPagination={needsPagination}
                  totalCards={totalCards}
                />
              ))
            ) : (
              cards.map((card, index) => (
                <FanCard
                  key={card.imgUrl}
                  card={card}
                  index={index}
                  slot={index}
                  isEntering={false}
                  enterDirection={undefined}
                  needsPagination={false}
                  totalCards={totalCards}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {needsPagination && (
        <div className="z-30 mt-4 flex items-center justify-center gap-4 md:mt-6">
          <button
            className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`}
            onClick={() => cycle("left")}
            aria-label="Previous"
          >
            {chevron("left")}
          </button>
          <div className="flex items-center gap-2">
            {cards.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${i === centerIndex ? "bg-black/70 dark:bg-white/80 scale-[1.3]" : "bg-black/15 dark:bg-white/15"}`}
              />
            ))}
          </div>
          <button
            className={`${ARROW_CLASSES} w-10 h-10 md:w-12 md:h-12`}
            onClick={() => cycle("right")}
            aria-label="Next"
          >
            {chevron("right")}
          </button>
        </div>
      )}
    </section>
  );
}
