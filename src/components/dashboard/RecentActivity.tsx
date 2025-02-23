import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Clock } from "lucide-react";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  course: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    action: "Marked attendance",
    course: "Introduction to Computer Science",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    action: "Created session",
    course: "Data Structures",
    timestamp: "3 hours ago",
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
    action: "Updated attendance",
    course: "Web Development",
    timestamp: "5 hours ago",
  },
];

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = defaultActivities,
}) => {
  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px] w-full pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-2 rounded-lg hover:bg-gray-50"
              >
                <Avatar>
                  <AvatarImage
                    src={activity.user.avatar}
                    alt={activity.user.name}
                  />
                  <AvatarFallback>
                    {activity.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {activity.action} in {activity.course}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
