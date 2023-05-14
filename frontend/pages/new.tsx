import NavbarLayout from "../components/atoms/navbarLayout"
import NewTodo from "../components/newTodo/newTodo"

export default function newTodo(props: any) {
    return (
        <NavbarLayout reactElement={<NewTodo />} title={"Create New Todo"} />
    )
}