import NavbarLayout from "../components/atoms/navbarLayout"
import UpdatePassword from "../components/updatePassword"

export default function newTodo(props: any) {
    return (
        <NavbarLayout reactElement={<UpdatePassword />} title={"Update password"} />
    )
}
