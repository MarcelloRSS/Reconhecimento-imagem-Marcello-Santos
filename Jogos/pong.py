import pygame
import sys
import random

# Inicializacao do Pygame
pygame.init()

# Cores (Estilo Atari: Preto e Branco)
PRETO = (0, 0, 0)
BRANCO = (255, 255, 255)

# Dimensoes da tela
LARGURA = 800
ALTURA = 600
tela = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Pong - Estilo Atari")

# Relogio para controle de FPS
relogio = pygame.time.Clock()
FPS = 60

# Variaveis do jogo
tamanho_raquete = [15, 100]
tamanho_bola = 15

# Posicoes iniciais
pos_jogador = [30, ALTURA // 2 - tamanho_raquete[1] // 2]
pos_oponente = [LARGURA - 30 - tamanho_raquete[0], ALTURA // 2 - tamanho_raquete[1] // 2]
pos_bola = [LARGURA // 2 - tamanho_bola // 2, ALTURA // 2 - tamanho_bola // 2]

# Velocidades
vel_jogador = 0
vel_oponente = 5
vel_bola = [5, 5]

# Pontuacao
pontos_jogador = 0
pontos_oponente = 0
fonte = pygame.font.Font(None, 74)

def desenhar_elementos():
    tela.fill(PRETO)
    
    # Linha central pontilhada
    para_baixo = 0
    while para_baixo < ALTURA:
        pygame.draw.rect(tela, BRANCO, (LARGURA // 2 - 2, para_baixo, 4, 15))
        para_baixo += 30

    # Jogador, Oponente e Bola
    pygame.draw.rect(tela, BRANCO, (pos_jogador[0], pos_jogador[1], tamanho_raquete[0], tamanho_raquete[1]))
    pygame.draw.rect(tela, BRANCO, (pos_oponente[0], pos_oponente[1], tamanho_raquete[0], tamanho_raquete[1]))
    pygame.draw.rect(tela, BRANCO, (pos_bola[0], pos_bola[1], tamanho_bola, tamanho_bola))

    # Pontuacao
    texto_jogador = fonte.render(str(pontos_jogador), True, BRANCO)
    texto_oponente = fonte.render(str(pontos_oponente), True, BRANCO)
    tela.blit(texto_jogador, (LARGURA // 4, 20))
    tela.blit(texto_oponente, (LARGURA - LARGURA // 4, 20))

    pygame.display.flip()

def resetar_bola(quem_pontuou):
    global pos_bola, vel_bola
    pos_bola = [LARGURA // 2 - tamanho_bola // 2, ALTURA // 2 - tamanho_bola // 2]
    # Inverte a direcao para quem tomou o ponto
    if quem_pontuou == "jogador":
        vel_bola = [-5, random.choice([-5, 5])]
    else:
        vel_bola = [5, random.choice([-5, 5])]

while True:
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        
        # Controles do jogador
        if evento.type == pygame.KEYDOWN:
            if evento.key == pygame.K_UP:
                vel_jogador = -7
            if evento.key == pygame.K_DOWN:
                vel_jogador = 7
        if evento.type == pygame.KEYUP:
            if evento.key == pygame.K_UP or evento.key == pygame.K_DOWN:
                vel_jogador = 0

    # Atualizacao de posicoes
    pos_jogador[1] += vel_jogador
    
    # Limites do jogador na tela
    if pos_jogador[1] < 0:
        pos_jogador[1] = 0
    if pos_jogador[1] > ALTURA - tamanho_raquete[1]:
        pos_jogador[1] = ALTURA - tamanho_raquete[1]

    # Movimento do oponente (IA simples)
    if pos_oponente[1] + tamanho_raquete[1] // 2 < pos_bola[1]:
        pos_oponente[1] += vel_oponente
    elif pos_oponente[1] + tamanho_raquete[1] // 2 > pos_bola[1]:
        pos_oponente[1] -= vel_oponente

    # Limites do oponente na tela
    if pos_oponente[1] < 0:
        pos_oponente[1] = 0
    if pos_oponente[1] > ALTURA - tamanho_raquete[1]:
        pos_oponente[1] = ALTURA - tamanho_raquete[1]

    # Movimento da bola
    pos_bola[0] += vel_bola[0]
    pos_bola[1] += vel_bola[1]

    # Colisao da bola com as bordas superior e inferior
    if pos_bola[1] <= 0 or pos_bola[1] >= ALTURA - tamanho_bola:
        vel_bola[1] = -vel_bola[1]

    # Colisao com as raquetes
    raquete_jogador = pygame.Rect(pos_jogador[0], pos_jogador[1], tamanho_raquete[0], tamanho_raquete[1])
    raquete_oponente = pygame.Rect(pos_oponente[0], pos_oponente[1], tamanho_raquete[0], tamanho_raquete[1])
    bola_rect = pygame.Rect(pos_bola[0], pos_bola[1], tamanho_bola, tamanho_bola)

    if bola_rect.colliderect(raquete_jogador) and vel_bola[0] < 0:
        vel_bola[0] = -vel_bola[0]
        # Aumentar a velocidade levemente a cada rebatida
        vel_bola[0] -= 0.5 if vel_bola[0] < 0 else -0.5
    
    if bola_rect.colliderect(raquete_oponente) and vel_bola[0] > 0:
        vel_bola[0] = -vel_bola[0]
        vel_bola[0] -= 0.5 if vel_bola[0] > 0 else -0.5

    # Pontuacao (quando a bola sai pelos lados)
    if pos_bola[0] < 0:
        pontos_oponente += 1
        resetar_bola("oponente")
    elif pos_bola[0] > LARGURA:
        pontos_jogador += 1
        resetar_bola("jogador")

    desenhar_elementos()
    relogio.tick(FPS)
