#!/usr/bin/env python3
"""Attach the authorized Pages domain without overwriting conflicting DNS records.

Requires a successful deployment first. Credentials are read from the environment;
only resource names and statuses are printed, never token values or HTTP headers.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

PROJECT = "zyrix-portfolio"
DOMAIN = "dev.zyrix.qzz.io"
ZONE = "zyrix.qzz.io"


def main():
    token = os.environ.get("CLOUDFLARE_API_TOKEN")
    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID")
    if not token or not account:
        sys.exit("Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID securely first.")
    if not all(c in "0123456789abcdef" for c in account) or len(account) != 32:
        sys.exit("CLOUDFLARE_ACCOUNT_ID must be a 32-character hexadecimal account ID.")

    def api(path, method="GET", payload=None):
        request = urllib.request.Request(
            "https://api.cloudflare.com/client/v4" + path,
            data=json.dumps(payload).encode() if payload is not None else None,
            headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
            method=method,
        )
        try:
            with urllib.request.urlopen(request, timeout=40) as response:
                body = json.load(response)
        except urllib.error.HTTPError as error:
            sys.exit(f"Cloudflare returned HTTP {error.code} for {method} {path}. Check account, token permissions, and network access.")
        except urllib.error.URLError:
            sys.exit("Cloudflare could not be reached. Check the environment's network settings.")
        if not body.get("success"):
            sys.exit("Cloudflare did not confirm success. Review token permissions and resource state.")
        return body["result"]

    project_path = f"/accounts/{account}/pages/projects/{PROJECT}"
    project = api(project_path)
    target = project.get("subdomain")
    if not target or not target.endswith(".pages.dev"):
        sys.exit("The Pages project did not return a valid pages.dev hostname.")
    zones = api("/zones?" + urllib.parse.urlencode({"name": ZONE, "account.id": account}))
    if len(zones) != 1:
        sys.exit(f"Expected exactly one {ZONE} zone in this account; found {len(zones)}.")
    zone_id = zones[0]["id"]
    dns_path = f"/zones/{zone_id}/dns_records"
    records = api(dns_path + "?" + urllib.parse.urlencode({"name": DOMAIN}))
    conflicting = [r for r in records if r["type"] != "CNAME" or r["content"].rstrip(".") != target.rstrip(".")]
    if conflicting:
        sys.exit(f"Existing DNS records conflict at {DOMAIN}. No records were changed. Review them before continuing.")
    domains = api(project_path + "/domains")
    if not any(d["name"] == DOMAIN for d in domains):
        api(project_path + "/domains", "POST", {"name": DOMAIN})
        print(f"Attached {DOMAIN} to {PROJECT}.")
    if not records:
        api(dns_path, "POST", {"type": "CNAME", "name": DOMAIN, "content": target, "ttl": 1, "proxied": True})
        print(f"Created CNAME {DOMAIN} -> {target}.")
    status = api(project_path + "/domains/" + DOMAIN)
    print(f"Domain status: {status.get('status', 'unknown')}. Verify HTTPS after Cloudflare activates the certificate.")


if __name__ == "__main__":
    main()
