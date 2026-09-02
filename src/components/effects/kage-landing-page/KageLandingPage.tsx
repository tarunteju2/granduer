import "./styles.css";

interface KageLandingPageProps {
  title?: string;
  sourceUrl?: string;
  className?: string;
}

export function KageLandingPage({
  title = "Kage",
  sourceUrl = "/landing-pages/kage.html",
  className = "",
}: KageLandingPageProps) {
  return (
    <div className={`kage-frame-container ${className}`}>
      <iframe
        src={sourceUrl}
        title={title}
        className="kage-iframe"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
      />
    </div>
  );
}

export default KageLandingPage;
