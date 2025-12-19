interface ParticlesProps {
    isUpsideDownMode: boolean;
    count?: number;
}

export default function Particles({ isUpsideDownMode, count = 15 }: ParticlesProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`particle ${isUpsideDownMode ? 'particle--upside-down' : 'particle--hawkins'}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${10 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                />
            ))}
        </>
    );
}

