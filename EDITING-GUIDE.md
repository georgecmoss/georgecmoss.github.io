# Editing Your Site — Quick Reference

Every page is plain HTML: find the text between tags, edit it on GitHub
(pencil icon → edit → commit), and the live site updates within a
minute or two. You never need to touch `style.css` or `script.js` for
text changes.

## Where each piece of content lives

| Page | What's in it |
|---|---|
| `index.html` | Hero name/tagline, About bio, On My Radar cards, Writing section, Work case studies, Contact copy |
| `resources.html` | "How I Learn" write-up and cadence list. (Reading list is automatic, pulls from your Goodreads shelf, nothing to edit there.) |
| `now.html` | "Active Pursuits" list, plus Travel and Events, meant to be updated often |
| `uses.html` | Hardware / Software / Work tools lists |
| `thank-you.html` | Message shown after someone submits the contact form |
| `404.html` | Message shown for a broken link |

## Sections still using placeholder text

None right now, everything's filled in. New sections you add later will
need real content, obviously.

## The one syntax quirk

If you're typing an ampersand, write `&amp;` instead of a bare `&`
(e.g. "Energy `&amp;` The World"). Everything else — normal
punctuation, quotes, numbers — you can type as-is.

## A tip for finding text fast

Use Ctrl+F (or Cmd+F) in GitHub's editor to search for a phrase you
know is nearby, rather than scrolling through the whole file.

## QR code (for your own use, not on the live site)

If you want a QR code for a business card, resume footer, or conference
badge, this URL generates one on the fly, no account needed, just open
it in a browser and save the image:

```
https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https%3A%2F%2Fgeorgecmoss.github.io%2F&color=241c14&bgcolor=f6efe4&margin=10
```

Swap the `size=400x400` for a bigger number if you need higher
resolution for print. This isn't embedded on the site itself anymore,
it's just here so you don't have to hunt for the link format again.
