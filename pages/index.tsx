/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header/Header'
import { useIsScrollEnd } from '../hooks/useIsScrollEnd'
import { Cat, getCats } from '../HTTP/request'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [response, setResponse] = useState<Array<Cat>>([])
  const [connected, setConnected] = useState<Boolean>(false)
  const [favCats, setFavCats] = useState<Array<string>>([])
  const [newCatsLoaded, setNewCatsLoaded] = useState<Boolean>(true)
  const [forceRefresh, setForceRefresh] = useState<Boolean>() //неприятный но безотказный костыль
  const isScrollEnd = useIsScrollEnd()
  const [catsStateRefresh, setCatsStateRefresh] = useState<Boolean>(false) //нормальные люди для этого используют Redux, но мне лень создавать стор(с тайпскриптом, без него изи ваще), поэтому я решил воткнуть костыль

  useEffect(() => {
    window.onstorage =  event => { setCatsStateRefresh(prev => !prev)};
    let myCats = localStorage.getItem('cats') === null ? [] :  JSON.parse(localStorage.getItem('cats') ?? '');
    setFavCats(myCats);
  }, [catsStateRefresh])
  
  useEffect(() => {
    if (!connected) {
      let myCats = localStorage.getItem('cats') === null ? [] :  JSON.parse(localStorage.getItem('cats') ?? '');
      setFavCats(myCats);
      getCats().then(res => {
        setResponse(res.data);
        setConnected(true);
      })
    }
  }, [])

  useEffect(() => {
    if (connected && isScrollEnd && newCatsLoaded) {
      setNewCatsLoaded(false);
      getCats().then(res => {
        setResponse(prev => prev.concat(res.data));
        setNewCatsLoaded(true);
      })
    }
  }, [isScrollEnd])
  

  if (!connected) {
    return (
      <>
        <Header></Header>
        <div className={styles.loader} >
          <img src="/index/loader.svg" alt="loading..."></img>
        </div>
      </>
    )
  }

  let onFavClick = (v: Cat) => {
    if (!favCats.includes(v.url)) {
      setFavCats(prev => { prev.push(v.url); return prev; });
      if (localStorage.getItem('cats') === null) {
        localStorage.setItem('cats', JSON.stringify([v.url]));
      } else {
        let currCats = JSON.parse(localStorage.getItem('cats') ?? ""); //заглушка для тупого ts в vscode который не видит моего ветвления (29 строка) боже....
        currCats.push(v.url);
        localStorage.setItem('cats', JSON.stringify(currCats));
      }
    }
    else {
      setFavCats(prev => prev.filter(e => e != v.url));
      if (localStorage.getItem('cats') !== null) {
        let currCats = JSON.parse(localStorage.getItem('cats') ?? ""); 
        currCats = currCats.filter((item: string)  => item !== v.url);
        localStorage.setItem('cats', JSON.stringify(currCats));
      }
    }

    setForceRefresh(prev => !prev)
  }

  return (
    <>
      <Header></Header>
      <div className={styles.cats}>
        { 
          response.map((v: Cat, k: number) => 
            <div className={styles['container_pic']} key={v.id}>
              <img onClick={() => { window.open(v.url, '_blank'); }} src={v.url} alt="sorry:("/>
              {
                favCats.includes(v.url) ? 
                <div onClick={(e) => { onFavClick(v) }} className={styles.fav_active}></div> :
                <div onClick={(e) => { onFavClick(v) }} className={styles.fav}></div>
              }
            </div>
          )
        }
      </div>
      {!newCatsLoaded? <div className={styles['loader-sm']} >
          <img src="/index/loader.svg" alt="loading..."></img>
        </div> : null}
    </>
  )
}

export default Home
