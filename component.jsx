/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hWGKDMrfpP7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 md:px-6 flex items-center h-16">
          <Link href="#" className="flex items-center gap-2 font-semibold text-lg" prefetch={false}>
            <YoutubeIcon className="w-6 h-6 text-red-500" />
            YouTube
          </Link>
          <div className="flex-1 ml-6 max-w-md">
            <form>
              <Input
                type="search"
                placeholder="Search"
                className="w-full rounded-full px-4 py-2 bg-muted focus:ring-2 focus:ring-primary"
              />
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 border">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-[240px_1fr] gap-6 p-6">
        <nav className="bg-background rounded-lg shadow-sm p-4 space-y-2">
          <Link href="#" className="flex items-center gap-2 font-medium text-primary" prefetch={false}>
            <HomeIcon className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <CompassIcon className="w-5 h-5" />
            Explore
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Subscriptions
          </Link>
          <Separator className="my-2" />
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <LibraryIcon className="w-5 h-5" />
            Library
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <CalendarIcon className="w-5 h-5" />
            History
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <ClockIcon className="w-5 h-5" />
            Watch Later
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            prefetch={false}
          >
            <ThumbsUpIcon className="w-5 h-5" />
            Liked Videos
          </Link>
        </nav>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <Link href="#" className="block" prefetch={false}>
              <img
                src="/placeholder.svg"
                width={320}
                height={180}
                alt="Thumbnail"
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2">Vercel Ship Keynote: Introducing the frontend cloud</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    alt="Channel Avatar"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <div>
                    <div className="font-medium">Vercel</div>
                    <div>70K subscribers</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">1.2M views • 2 months ago</div>
              </div>
            </Link>
          </div>
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <Link href="#" className="block" prefetch={false}>
              <img
                src="/placeholder.svg"
                width={320}
                height={180}
                alt="Thumbnail"
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2">Introducing v0: Generative UI</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    alt="Channel Avatar"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <div>
                    <div className="font-medium">Vercel</div>
                    <div>300K subscribers</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">300K views • 5 days ago</div>
              </div>
            </Link>
          </div>
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <Link href="#" className="block" prefetch={false}>
              <img
                src="/placeholder.svg"
                width={320}
                height={180}
                alt="Thumbnail"
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2">Using Vercel KV with Svelte</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    alt="Channel Avatar"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <div>
                    <div className="font-medium">Lee Robinson</div>
                    <div>21K subscribers</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">21K views • 1 week ago</div>
              </div>
            </Link>
          </div>
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <Link href="#" className="block" prefetch={false}>
              <img
                src="/placeholder.svg"
                width={320}
                height={180}
                alt="Thumbnail"
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2">Loading UI with Next.js 13</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    alt="Channel Avatar"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <div>
                    <div className="font-medium">Delba</div>
                    <div>12K subscribers</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">12K views • 10 days ago</div>
              </div>
            </Link>
          </div>
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <Link href="#" className="block" prefetch={false}>
              <img
                src="/placeholder.svg"
                width={320}
                height={180}
                alt="Thumbnail"
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2">Introducing the frontend cloud</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    alt="Channel Avatar"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <div>
                    <div className="font-medium">Vercel</div>
                    <div>1.2M subscribers</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">1.2M views • 2 months ago</div>
              </div>
            </Link>
          </div>
          <div className="bg-background rounded-lg shadow-sm overflow-hidden">
            <Link href="#" className="block" prefetch={false}>
              <img
                src="/placeholder.svg"
                width={320}
                height={180}
                alt="Thumbnail"
                className="w-full aspect-video object-cover"
              />
              <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2">
                  World of Warcraft: Shadowlands - Chains of Domination Patch 9.1 Trailer (2021) - PC
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img
                    src="/placeholder.svg"
                    width={32}
                    height={32}
                    alt="Channel Avatar"
                    className="rounded-full"
                    style={{ aspectRatio: "32/32", objectFit: "cover" }}
                  />
                  <div>
                    <div className="font-medium">Blizzard Entertainment</div>
                    <div>10M subscribers</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">5M views • 2 years ago</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}


function CompassIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}


function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}


function LibraryIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  )
}


function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}


function ThumbsUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}


function YoutubeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}
