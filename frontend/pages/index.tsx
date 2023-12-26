import { useState, useEffect } from "react"
import { checkAuth } from "../services/api/userController"
import NavbarLayout from "../components/atoms/navbarLayout"


export default function Login(props: any) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response = await checkAuth()
      setIsLoggedIn(response.isSuccess)
    })()
  })

        
  const reactElementLoggedIn = (
    <h1>Congrats, you are logged in</h1>
  )
  const reactElementNotLoggedIn = (
    <h1>You are not logged in</h1>
  )

  return (
    <NavbarLayout reactElement={isLoggedIn ? reactElementLoggedIn : reactElementNotLoggedIn} title={'Hello World'} />
  )
}