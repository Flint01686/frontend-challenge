//TODO: chek
import { useState, useEffect } from 'react'

export function useIsScrollEnd()
{
    let [isScrollEnd, setIsScrollEnd] = useState<boolean>(false)

    function refreshState(e: any): void
    {
        setIsScrollEnd(scrollY + innerHeight + 0.5 >= document.body.scrollHeight)
    }
    
    useEffect(() => {
        let scrolListener = (e: any) => refreshState(e)
        window.addEventListener("scroll", scrolListener);
        return () => {
            window.removeEventListener("scroll", scrolListener);
        }
    }, [])

    return isScrollEnd;
}