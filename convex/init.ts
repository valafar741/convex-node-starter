import { mutation } from "./_generated/server";

export default mutation(async (ctx) => {
  if (!(await ctx.db.query("messages").first())) {
    await ctx.db.insert("messages", {
      author: "Tom",
      body: "Hey there!",
    });
    await ctx.db.insert("messages", {
      author: "Lee",
      body: "Hello.",
    });
  }
});
