/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header/Header'
import { Cat, getCats } from '../HTTP/request'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [favCats, setFavCats] = useState<Array<string>>([])
  const [forceRefresh, setForceRefresh] = useState<Boolean>() 
  const [catsStateRefresh, setCatsStateRefresh] = useState<Boolean>(false) //нормальные люди для этого используют Redux, но мне лень создавать стор(с тайпскриптом, без него изи ваще), поэтому я решил воткнуть костыль

  useEffect(() => {
    window.onstorage =  event => { setCatsStateRefresh(prev => !prev)};
    let myCats = localStorage.getItem('cats') === null ? [] :  JSON.parse(localStorage.getItem('cats') ?? '');
    setFavCats(myCats);
  }, [catsStateRefresh])

  let onFavClick = (v: string) => { //сорре за гавнокод, просто не очень чето продумал, надо было в отдельный компонент сразу вынести
    if (!favCats.includes(v)) {
      setFavCats(prev => { prev.push(v); return prev; });
      if (localStorage.getItem('cats') === null) {
        localStorage.setItem('cats', JSON.stringify([v]));
      } else {
        let currCats = JSON.parse(localStorage.getItem('cats') ?? "");
        currCats.push(v);
        localStorage.setItem('cats', JSON.stringify(currCats));
      }
    }
    else {
      setFavCats(prev => prev.filter(e => e != v));
      if (localStorage.getItem('cats') !== null) {
        let currCats = JSON.parse(localStorage.getItem('cats') ?? ""); 
        currCats = currCats.filter((item: string)  => item !== v);
        localStorage.setItem('cats', JSON.stringify(currCats));
      }
    }

    setForceRefresh(prev => !prev)
  }

  return (
    <>
      <Header></Header>
      {
        favCats.length !== 0 ?
          <div className={styles.cats}>
          { 
            favCats.map((v: string, k: number) => 
              <div className={styles['container_pic']} key={v}>
                <img onClick={() => { window.open(v, '_blank'); }} src={v} alt="sorry:("/>
                {
                  favCats.includes(v) ? 
                  <div onClick={(e) => { onFavClick(v) }} className={styles.fav_active}></div> :
                  <div onClick={(e) => { onFavClick(v) }} className={styles.fav}></div>
                }
              </div>
            )
          }
          </div> : <p className={styles.cats_request}>
            😸<Link href="/"><a>Добавьте котиков!</a></Link> Не верю что вам ни один не понравился...😸
          </p>
      }
    </>
  )
}

export default Home





