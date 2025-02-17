import { gql, useMutation, useQuery } from "@apollo/client";
import { nanoid } from "nanoid";
import StyledCard from "../../../../../components/styled-card";

import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { useState, useEffect } from "react";
import { StashSnapshotProfile } from "../../../../../__generated__/graphql";
import Link from "next/link";
import { StyledTooltip } from "../../../../../components/styled-tooltip";

export default function Profiles() {
  const [profiles, setProfiles] = useState<StashSnapshotProfile[]>([]);
  const { refetch: refetchProfiles } = useQuery(
    gql`
      query StashSnapshotProfiles {
        stashSnapshotProfiles {
          id
          userId
          league
          name
          public
          poeStashTabIds
          valuationTargetPValue
          valuationStockInfluence
        }
      }
    `,
    {
      onCompleted(data) {
        setProfiles(data.stashSnapshotProfiles);
      },
    }
  );

  const [deleteProfile] = useMutation(
    gql`
      mutation DeleteStashSnapshotProfile($stashSnapshotProfileId: String!) {
        deleteStashSnapshotProfile(
          stashSnapshotProfileId: $stashSnapshotProfileId
        )
      }
    `,
    {
      onCompleted(data, clientOptions) {
        refetchProfiles();
      },
    }
  );

  useEffect(() => {
    refetchProfiles();
  });

  return (
    <>
      <StyledCard title={"Profiles"}>
        <div>
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center mr-2">
              <StyledTooltip
                texts={[
                  "Create Profile to save custom stash profiles.",
                  "You can have numerous profiles.",
                ]}
                placement="left"
              >
                <button className="w-5 h-5 ">
                  <InformationCircleIcon />
                </button>
              </StyledTooltip>
              <Link
                className="bg-theme-color-3 hover:bg-blue-700 py-1 px-1  rounded-lg"
                href={"/poe/stash/snapshot/profiles/" + nanoid() + "/edit"}
              >
                {" "}
                <p>Create Profile</p>
              </Link>
            </div>
          </div>
          <div className="overflow-y-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="w-full">
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((profile, index) => (
                  <tr key={index}>
                    <td>
                      <Link
                        className="hover:text-skin-accent"
                        href={"/poe/stash/snapshot/profiles/" + profile.id}
                      >
                        {profile?.name}
                      </Link>
                    </td>

                    <td>
                      <div className="flex flex-row space-x-3">
                        <Link
                          className="hover:text-skin-accent"
                          href={
                            "/poe/stash/snapshot/profiles/" +
                            profile.id +
                            "/edit"
                          }
                        >
                          Edit
                        </Link>
                        <div
                          className="hover:text-skin-accent"
                          onClick={() => {
                            deleteProfile({
                              variables: { stashSnapshotProfileId: profile.id },
                            });
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StyledCard>
    </>
  );
}
