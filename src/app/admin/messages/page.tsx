import { db } from "@/lib/db";
import { Message, type MessageDoc } from "@/lib/models";
import { deleteMessage, setMessageRead } from "@/actions/admin";
import { formatDate } from "@/lib/format";
import { AdminHeader, Panel } from "../ui";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  await db();
  const messages = await Message.find().sort({ read: 1, createdAt: -1 }).limit(300).lean<MessageDoc[]>();
  return (
    <>
      <AdminHeader title="Messages" intro="From the contact form. Each one is also emailed to you." />
      <Panel>
        <ul className="flex flex-col divide-y divide-line">
          {messages.map((m) => {
            const wa = (m.phone ?? "").replace(/\D/g, "");
            return (
              <li key={String(m._id)} className={`flex flex-col gap-2 py-4 ${m.read ? "opacity-70" : ""}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p><strong>{m.name}</strong> · <span className="text-muted">{m.topic}</span> {!m.read && <span className="pill ml-1 bg-gold text-charcoal">New</span>}</p>
                  <span className="text-xs text-muted">{formatDate(m.createdAt, { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
                <p className="whitespace-pre-line text-[15px]">{m.message}</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <a className="btn-outline btn-sm border-line" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Hetty Global Academy")}`}>Reply by email</a>
                  {wa && <a className="btn-outline btn-sm border-line" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                  <form action={setMessageRead.bind(null, String(m._id), !m.read)}><button type="submit" className="btn-outline btn-sm border-line">{m.read ? "Mark unread" : "Mark read"}</button></form>
                  <form action={deleteMessage.bind(null, String(m._id))}><button type="submit" className="btn-outline btn-sm border-line text-[#8a1c1c]">Delete</button></form>
                </div>
              </li>
            );
          })}
          {messages.length === 0 && <li className="py-3 text-sm text-muted">No messages yet.</li>}
        </ul>
      </Panel>
    </>
  );
}
