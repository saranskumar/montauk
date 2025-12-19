interface StaticOverlayProps {
    noiseLevel: number;
    isActive: boolean;
}

export default function StaticOverlay({ noiseLevel, isActive }: StaticOverlayProps) {
    if (!isActive || noiseLevel < 10) return null;

    const opacity = Math.min(0.6, noiseLevel / 100);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[60]"
            style={{
                opacity,
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                animation: 'noise-shift 0.5s infinite',
            }}
        >
            <style>{`
        @keyframes noise-shift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5%, -5%); }
          50% { transform: translate(-10%, 5%); }
          75% { transform: translate(5%, -10%); }
        }
      `}</style>
        </div>
    );
}

