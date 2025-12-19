interface ParticlesProps {
    isRiftMode: boolean;
    count?: number;
}

export default function Particles({ isRiftMode, count = 15 }: ParticlesProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`particle ${isRiftMode ? 'particle--rift' : 'particle--montauk'}`}
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

