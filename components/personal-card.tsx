import { UserIcon } from "lucide-react";
import { Card } from "./ui/card";

interface Props {
 users: GetAllUsersType;
}
const badgeClassName = "bg-primary-gradient flex h-7 w-full minw-0 justify-start gap-1 tabular-nums"

export default function PersonalCard({users} : Props) {
  return (
    <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-3">
        <UserIcon />
      </div>
    </Card>
  )
}
