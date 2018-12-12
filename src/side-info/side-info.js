class SideViewManager {
    constructor() {
        this.representativeThesis = new RepresentativeThesis();
        this.groupKeyword = new GroupKeyword();
        this.networkManager = new NetworkManager();
    }

    makeView(group, representativeThesisId, groupColor) {
        this.representativeThesis.destroyView();
        this.representativeThesis.makeView(representativeThesisId);

        this.groupKeyword.destroyView();
        this.groupKeyword.makeView(group);

        this.networkManager.destroyNetwork();
        this.networkManager.makeNetwork(group, representativeThesisId, groupColor);
    }
}

const sideViewManager = new SideViewManager();

// sideViewManager.makeView([
//         "4be8eaca-a28a-4382-86c2-9314735066bd",
//         "7281e056-a2f6-4df3-bd54-fbd8ed8b737c",
//         "78efca65-ac1a-49bd-92ec-c8f0770fefb8",
//         "7d911d74-c4c1-4d4d-a737-5cf51e404c83",
//         "85bd9cc6-e41a-4fd4-8f3b-e776329efc4b",
//         "aa16086f-f3bf-432a-bfcd-9f1521c9ac52",
//         "cab91964-4e8d-4211-8d32-455cfd690b60",
//         "dc00221e-92c4-4ee4-8a7b-666ab5fd28c5",
//         "ea9489be-45f6-482f-937c-11b644d5f2ce",
//         "f258af24-e04a-49d4-86c3-1ab1c2f43914",
//         "fa96abdc-7c09-419b-a00d-4c24d5879eeb"
//     ],
//     "fa96abdc-7c09-419b-a00d-4c24d5879eeb",
//     '#311B92');
//
// setTimeout(() => {
//     sideViewManager.makeView([
//             '2cf70f2e-9996-477e-9ba1-d02ec769c507',
//             '324c0cc6-829c-4b4f-8ef4-5f2d9b34bf58',
//             '52787900-26ba-4272-9e1f-42d9fd36943b',
//             '748a2ab3-8b5f-4d0a-9e2d-af685089843a',
//             '8b7e4047-9b6d-4ce2-aed4-ae8632361657',
//         ],
//         '52787900-26ba-4272-9e1f-42d9fd36943b',
//         '#311B92');
// }, 2000);



