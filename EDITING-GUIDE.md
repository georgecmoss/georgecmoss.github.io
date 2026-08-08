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

## Custom domain: georgecmoss.com (planned, not live yet)

I generated a `CNAME` file (just contains the text `georgecmoss.com`)
that's ready to upload once you actually own the domain. Do NOT upload
it before then, it would break the live site by pointing GitHub Pages
at a domain that doesn't exist yet.

When you're ready, in order:

1. Buy `georgecmoss.com` from a registrar (Namecheap, Cloudflare, etc.)
2. Add the DNS records GitHub requires (4 A records for the root
   domain, pointing to GitHub's IPs: 185.199.108.153, .109.153,
   .110.153, .111.153, plus a CNAME record for "www" pointing to
   georgecmoss.github.io)
3. Upload the `CNAME` file to your repo root
4. In your repo, go to Settings, Pages, Custom domain, enter
   georgecmoss.com, save, then tick "Enforce HTTPS" once it's
   available (can take a few hours)
5. **Come back and tell me it's live** — I'll then update every
   hardcoded `georgecmoss.github.io` reference across the site
   (canonical tags, the OG share image, sitemap.xml, robots.txt, the
   vCard, the contact form's redirect) to point at the new domain in
   one batch. Doing this before DNS is live would leave those pointing
   at a dead link in the meantime, so it's worth waiting for.

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
