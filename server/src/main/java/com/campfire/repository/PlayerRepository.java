package com.campfire.repository;

import com.campfire.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {
    List<Player> findByRoomIdOrderByJoinedAtAsc(UUID roomId);
    Optional<Player> findBySessionToken(String sessionToken);
    Optional<Player> findByRoomIdAndDisplayNameIgnoreCase(UUID roomId, String displayName);
    long countByRoomId(UUID roomId);
}
