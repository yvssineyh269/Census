export default function AddNewUserPage() {
    // const users = await getUsers();
  return (
    <div className="px-4 py-6 sm:py-10 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Inventaire des produits
        </h1>
        <p className="text-muted-foreground mt-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi
          mollitia blanditiis perspiciatis in voluptates ipsam harum, obcaecati
          reiciendis aut quasi quas, odio velit itaque cumque dolorem eos.
          Quibusdam, velit repellat?
        </p>
      </div>
      {/* Cartes des produits */}
      {/* {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
          <p className="text-xl font-medium">Pas de prduit sur la plateforme pour l'instant</p>
        </div>
      ) : (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((item) => (
            <PersonnalCard key={item.id} products={item} />
          ))}
        </div>
      )} */}
    </div>
  )
}
