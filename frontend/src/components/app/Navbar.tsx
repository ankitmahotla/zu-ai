import { Button } from "../ui/button"

function Navbar() {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">ZuAI</h1>
                <div>
                    <Button variant="outline" className="mr-2">Login</Button>
                    <Button>Join Now</Button>
                </div>
            </div>
        </header>
    )
}

export default Navbar;
