import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import styles from './/Header.module.scss'

enum Choice{
    all,
    lovely
}

const Header: FC = () => {
  const router = useRouter()
  const [choice, setChoice] = useState<Choice>(router.pathname == '/' ? Choice.all : Choice.lovely)
  return (
    <header className={styles.header}>
      <div
        onClick={() => { setChoice(Choice.all); document.location.href='/'; }}
        className={choice == Choice.all ? styles.active : ''}>
        <p>Все котики</p>
      </div>
      <div 
        onClick={() => { setChoice(Choice.lovely); document.location.href='/lovely'; }}
        className={choice == Choice.lovely ? styles.active : ''}>
        <p>Любимые котики</p>
      </div>
    </header>
  )
}

export default Header
