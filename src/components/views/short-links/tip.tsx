import { Link2Icon } from "lucide-react";

export default function TipBox() {
  return (
    <div className="border border-x-blue-200 bg-blue-50 rounded-2xl p-7 space-y-7">
      <div className="space-y-3">
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <Link2Icon className="size-7 text-blue-500" />
          <span>Short Link IDs for Social Posts</span>
        </h2>
        <p>
          Short Links let you sell directly through your social posts without cluttering captions with long payment
          URLs.
        </p>
        <p>
          When you create a Short Link, we’ll give you a simple ID like SL#25043. Just include this ID anywhere in your
          post’s text or caption.
        </p>
        <p>
          Customers can go to our “Find Payment” page, enter the short link or paste the link to your post or enter, and
          we’ll instantly detect your Short Link ID, match it to your preset payment details, and send them straight to
          checkout.
        </p>
        <p>
          This makes it easier for customers to pay, even on platforms where clickable links aren’t allowed — perfect
          for Instagram.
        </p>
      </div>
    </div>
  );
}
