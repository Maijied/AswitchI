#!/usr/bin/env python3
"""
AswitchI Snapcraft 9 Release & Rollback Operations Manager
=========================================================
Adheres strictly to Canonical Snapcraft 9 documentation:
https://ubuntu.com/docs/snapcraft/9/how-to/publishing/manage-revisions-and-releases/

Commands:
  status                     - Show current channel and release status
  revisions                  - List all uploaded store revisions
  release <rev> <channel>    - Release/Promote a revision to channel (e.g. edge, beta, candidate, stable)
  progressive <rev> <pct>    - Deliver progressive release to stable (e.g. 10%, 25%, 50%)
  rollback <rev> <channel>   - Rollback channel to a previous revision
  close <channel>            - Close a channel to fall back to safer risk tier
"""

import sys
import subprocess
import argparse

SNAP_NAME = "aswitchi"


def run_snapcraft(cmd_args):
    full_cmd = ["snapcraft"] + cmd_args
    print(f"🔧 Executing: {' '.join(full_cmd)}")
    result = subprocess.run(full_cmd)
    if result.returncode != 0:
        print(f"❌ Command failed with exit code {result.returncode}")
        sys.exit(result.returncode)
    print("✓ Success")


def cmd_status(args):
    run_snapcraft(["status", SNAP_NAME])


def cmd_revisions(args):
    run_snapcraft(["revisions", SNAP_NAME])


def cmd_release(args):
    channels = args.channel
    rev = str(args.revision)
    cmd = ["release", SNAP_NAME, rev, channels]
    if args.progressive is not None:
        cmd.extend(["--progressive", str(args.progressive)])
    run_snapcraft(cmd)


def cmd_rollback(args):
    rev = str(args.revision)
    channel = args.channel
    print(f"⚠️  ROLLBACK INITIATED: Pointing channel '{channel}' back to Revision {rev}")
    run_snapcraft(["release", SNAP_NAME, rev, channel])
    print(f"✓ Channel '{channel}' has been rolled back to Revision {rev} successfully.")


def cmd_close(args):
    channel = args.channel
    print(f"🔒 Closing channel: {channel}")
    run_snapcraft(["close", SNAP_NAME, channel])


def main():
    parser = argparse.ArgumentParser(
        description="AswitchI Snapcraft 9 Release, Promotion & Rollback Manager"
    )
    subparsers = parser.add_subparsers(dest="action", required=True)

    # status
    p_status = subparsers.add_parser("status", help="Show active channel releases")
    p_status.set_defaults(func=cmd_status)

    # revisions
    p_rev = subparsers.add_parser("revisions", help="List all uploaded revisions")
    p_rev.set_defaults(func=cmd_revisions)

    # release
    p_rel = subparsers.add_parser("release", help="Release/promote a revision to channel")
    p_rel.add_argument("revision", type=int, help="Target revision number (e.g. 1)")
    p_rel.add_argument("channel", type=str, help="Destination channel (edge, beta, candidate, stable)")
    p_rel.add_argument("--progressive", type=int, default=None, help="Progressive release % (e.g. 20)")
    p_rel.set_defaults(func=cmd_release)

    # rollback
    p_roll = subparsers.add_parser("rollback", help="Rollback a channel to a previous revision")
    p_roll.add_argument("revision", type=int, help="Previous known-good revision number")
    p_roll.add_argument("--channel", type=str, default="stable", help="Channel to rollback (default: stable)")
    p_roll.set_defaults(func=cmd_rollback)

    # close
    p_close = subparsers.add_parser("close", help="Close a channel")
    p_close.add_argument("channel", type=str, help="Channel to close (e.g. beta, edge)")
    p_close.set_defaults(func=cmd_close)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
