import confetti from 'canvas-confetti';
import { useEffect, useRef } from 'react';

const Confetti = ({ success }) => {
    const hasFired = useRef(false);

    useEffect(() => {

        if (success && !hasFired.current) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            hasFired.current = true;
        }

        if (success == false) {
            hasFired.current = false;
        }
    }, [success])
}
export default Confetti;
